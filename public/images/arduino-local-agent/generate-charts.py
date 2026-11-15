"""Publication charts; run with an existing matplotlib installation. No device access.
English/minimal labels so the same chart works for both the PL and EN articles."""
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

OUT = Path(__file__).resolve().parent
plt.rcParams.update({'font.family':'DejaVu Sans', 'font.size':14,
                     'svg.fonttype':'none', 'axes.titleweight':'bold',
                     'axes.labelcolor':'#344456', 'text.color':'#14283e',
                     'xtick.color':'#536578', 'ytick.color':'#344456'})
BG='#f5f7fb'; BLUE='#235d9f'; TEAL='#087f80'; MUTED='#536578'; GRID='#dce4ed'

def base(title, subtitle, height=10):
    fig=plt.figure(figsize=(16,height), facecolor=BG)
    fig.text(.055,.942,title,size=27,weight='bold',va='top')
    fig.text(.055,.889,subtitle,size=16,color=MUTED,va='top')
    return fig

def clean(ax):
    ax.set_facecolor(BG)
    for s in ax.spines.values(): s.set_visible(False)
    ax.tick_params(axis='both',length=0,pad=10)
    ax.grid(axis='x',color=GRID,zorder=0)
    ax.set_axisbelow(True)

def save(fig,name):
    fig.savefig(OUT/(name+'.svg'),facecolor=BG)
    fig.savefig(OUT/(name+'.png'),dpi=150,facecolor=BG)
    plt.close(fig)

fig=base('Less HA context, shorter wait',
         'Qwen2.5-3B • same model and NPU config • before / after',9.8)
for rect,title,values,xmax,ticks,labels,unit in [
    ([.12,.42,.32,.30],'Input: original HA request',[7781,3550],9000,[0,4000,8000],['7,781','3,550'],'input tokens'),
    ([.60,.42,.32,.30],'Full sentence with HA context',[22.741,9.968],27,[0,10,20],['22.741 s','9.968 s'],'median time to end of LLM text [s]')]:
    ax=fig.add_axes(rect); clean(ax)
    ax.barh([1,0],values,height=.49,color=[BLUE,TEAL],zorder=3)
    ax.set_yticks([1,0],['Before','After']); ax.set_ylim(-.65,1.65)
    ax.set_xlim(0,xmax); ax.set_xticks(ticks); ax.set_xlabel(unit,labelpad=13,size=13)
    ax.set_title(title,loc='left',pad=24,size=18)
    for y,v,label in zip([1,0],values,labels):
        ax.text(v+xmax*.025,y,label,va='center',size=18,weight='bold')
fig.text(.12,.303,'−54% tokens',size=23,weight='bold',color=TEAL)
fig.text(.60,.303,'−56% time  /  2.28× faster',size=23,weight='bold',color=TEAL)
fig.text(.12,.255,'31 → 18 tools per request',size=15,color=MUTED)
fig.text(.60,.255,'3 runs per variant • still above the 4 s target',size=15,color=MUTED)
fig.text(.055,.190,'Measured the full LLM answer text — not first token, not the whole voice path.',size=16,weight='bold')
fig.text(.055,.147,'No STT, no HA tool execution / second LLM round, no TTS. A fixed sentence limits answer-length variance.',size=13.5)
fig.text(.055,.110,'Tokens: the original prompt. Time: the controlled full_ha_sentence case with the last question replaced.',size=13,color=MUTED)
fig.text(.055,.055,'Sources: ha25-vs-before.md • ha25-run1.md   |   Q4_0 · HTP0 · 10,240 context · resident WhisperSmallNPU',size=12,color=MUTED)
save(fig,'ha-context-before-after')

fig=base('NPU models: time is not the same as compliance',
         'Historic set: full HA / 31 tools • fixed Polish sentence • medians of 3 runs',12)
ax=fig.add_axes([.19,.595,.38,.19]); clean(ax)
ax.barh([1,0],[18.148,22.741],height=.49,color=[BLUE,TEAL],zorder=3)
ax.set_yticks([1,0],['Qwen3-1.7B\nGGUF / HTP0','Qwen2.5-3B\nGGUF / HTP0'])
ax.set_xlim(0,28);ax.set_ylim(-.65,1.65);ax.set_xticks([0,10,20]);ax.set_xlabel('time to end of LLM text [s]',size=13)
ax.set_title('A  Full HA context',loc='left',pad=20,size=18)
for y,v,s in [(1,18.148,'18.148 s'),(0,22.741,'22.741 s')]: ax.text(v+.5,y,s,va='center',size=17,weight='bold')
fig.text(.66,.803,'Command compliance',size=18,weight='bold')
fig.text(.66,.744,'2/3  ·  Qwen3-1.7B',size=20,weight='bold',color=BLUE)
fig.text(.66,.711,'1 run: a tool instead of the requested sentence',size=13,color=MUTED)
fig.text(.66,.661,'3/3  ·  Qwen2.5-3B',size=20,weight='bold',color=TEAL)
fig.text(.66,.628,'This tests answer form, not HA control quality.',size=12.5,color=MUTED)

ax=fig.add_axes([.19,.285,.38,.18]); clean(ax)
ax.barh([2,1,0],[1.203,1.805,2.063],height=.48,color=[BLUE,TEAL,'#7961a8'],zorder=3)
ax.set_yticks([2,1,0],['Qwen3-1.7B GGUF','Qwen2.5-3B GGUF','Qwen3-4B QAIRT'])
ax.set_xlim(0,2.65);ax.set_ylim(-.6,2.6);ax.set_xticks([0,1,2]);ax.set_xlabel('time to end of LLM text [s]',size=13)
ax.set_title('B  Short input, no HA context',loc='left',pad=21,size=18)
for y,v,s in [(2,1.203,'1.203 s'),(1,1.805,'1.805 s'),(0,2.063,'2.063 s')]:ax.text(v+.05,y,s,va='center',size=16,weight='bold')

fig.text(.66,.493,'C  4B at full HA context',size=18,weight='bold')
fig.text(.66,.450,'QAIRT / 4,096 context:  SKIP',size=16,weight='bold',color='#7961a8')
fig.text(.66,.418,'Input ~7,800 tokens did not fit in the\nconfigured window. No timing measured.',size=13,color=MUTED,linespacing=1.5,va='top')
fig.text(.66,.348,'GGUF / 10,240 context:  FAIL',size=16,weight='bold',color='#9b522e')
fig.text(.66,.316,'Load error: FastRPC mmap / ENOMEM.\nNo inference timing measured.',size=13,color=MUTED,linespacing=1.5,va='top')
fig.text(.055,.186,'No STT, no real HA tool execution / second LLM round, no TTS.',size=15,weight='bold')
fig.text(.055,.151,'Compliance = exact text / form, no unexpected tool, correct ending.',size=13)
fig.text(.055,.118,'SKIP does not prove 4B cannot run; FAIL concerns one attempt, not all configs.',size=13,color=MUTED)
fig.text(.055,.085,'4B QAIRT (2507) and 4B GGUF are different checkpoints. Short input is not a test of the full voice or full HA.',size=13,color=MUTED)
fig.text(.055,.042,'Source: wnioski.md • historic NPU benchmark with a resident WhisperSmallNPU; no CPU measurements.',size=12,color=MUTED)
save(fig,'npu-model-comparison')
