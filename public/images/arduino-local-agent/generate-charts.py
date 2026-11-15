"""Publication charts; run with an existing matplotlib installation. No device access."""
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

fig=base('Mniej kontekstu HA, krótsze oczekiwanie',
         'Qwen2.5-3B • ten sam model i konfiguracja NPU • porównanie przed / po',9.8)
for rect,title,values,xmax,ticks,labels,unit in [
    ([.12,.42,.32,.30],'Wejście: oryginalne żądanie HA',[7781,3550],9000,[0,4000,8000],['7 781','3 550'],'tokeny wejściowe'),
    ([.60,.42,.32,.30],'Pełne zdanie z kontekstem HA',[22.741,9.968],27,[0,10,20],['22,741 s','9,968 s'],'mediana czasu do końca tekstu LLM [s]')]:
    ax=fig.add_axes(rect); clean(ax)
    ax.barh([1,0],values,height=.49,color=[BLUE,TEAL],zorder=3)
    ax.set_yticks([1,0],['Przed','Po']); ax.set_ylim(-.65,1.65)
    ax.set_xlim(0,xmax); ax.set_xticks(ticks); ax.set_xlabel(unit,labelpad=13,size=13)
    ax.set_title(title,loc='left',pad=24,size=18)
    for y,v,label in zip([1,0],values,labels):
        ax.text(v+xmax*.025,y,label,va='center',size=18,weight='bold')
fig.text(.12,.303,'−54% tokenów',size=23,weight='bold',color=TEAL)
fig.text(.60,.303,'−56% czasu  /  2,28× szybciej',size=23,weight='bold',color=TEAL)
fig.text(.12,.255,'31 → 18 narzędzi w żądaniu',size=15,color=MUTED)
fig.text(.60,.255,'3 próby na wariant • nadal powyżej celu 4 s',size=15,color=MUTED)
fig.text(.055,.190,'Mierzono cały tekst odpowiedzi LLM — nie pierwszy token ani cały tor głosowy.',size=16,weight='bold')
fig.text(.055,.147,'Bez STT, wykonania narzędzi HA / drugiej rundy LLM i TTS. Stałe zdanie ogranicza różnice długości odpowiedzi.',size=13.5)
fig.text(.055,.110,'Tokeny: oryginalny prompt. Czas: kontrolowany przypadek full_ha_sentence z podmienionym ostatnim pytaniem.',size=13,color=MUTED)
fig.text(.055,.055,'Źródła: ha25-vs-before.md • ha25-run1.md   |   Q4_0 · HTP0 · kontekst 10 240 · rezydentny WhisperSmallNPU',size=12,color=MUTED)
save(fig,'ha-context-before-after')

fig=base('Modele NPU: czas to nie to samo co zgodność',
         'Historyczny zestaw: pełne HA / 31 narzędzi • stałe polskie zdanie • mediany 3 prób',12)
ax=fig.add_axes([.19,.595,.38,.19]); clean(ax)
ax.barh([1,0],[18.148,22.741],height=.49,color=[BLUE,TEAL],zorder=3)
ax.set_yticks([1,0],['Qwen3-1.7B\nGGUF / HTP0','Qwen2.5-3B\nGGUF / HTP0'])
ax.set_xlim(0,28);ax.set_ylim(-.65,1.65);ax.set_xticks([0,10,20]);ax.set_xlabel('czas do końca tekstu LLM [s]',size=13)
ax.set_title('A  Pełny kontekst HA',loc='left',pad=20,size=18)
for y,v,s in [(1,18.148,'18,148 s'),(0,22.741,'22,741 s')]: ax.text(v+.5,y,s,va='center',size=17,weight='bold')
fig.text(.66,.803,'Zgodność z poleceniem',size=18,weight='bold')
fig.text(.66,.744,'2/3  ·  Qwen3-1.7B',size=20,weight='bold',color=BLUE)
fig.text(.66,.711,'1 próba: narzędzie zamiast zadanego zdania',size=13,color=MUTED)
fig.text(.66,.661,'3/3  ·  Qwen2.5-3B',size=20,weight='bold',color=TEAL)
fig.text(.66,.628,'To test formy odpowiedzi, nie jakości sterowania HA.',size=12.5,color=MUTED)

ax=fig.add_axes([.19,.285,.38,.18]); clean(ax)
ax.barh([2,1,0],[1.203,1.805,2.063],height=.48,color=[BLUE,TEAL,'#7961a8'],zorder=3)
ax.set_yticks([2,1,0],['Qwen3-1.7B GGUF','Qwen2.5-3B GGUF','Qwen3-4B QAIRT'])
ax.set_xlim(0,2.65);ax.set_ylim(-.6,2.6);ax.set_xticks([0,1,2]);ax.set_xlabel('czas do końca tekstu LLM [s]',size=13)
ax.set_title('B  Krótkie wejście, bez kontekstu HA',loc='left',pad=21,size=18)
for y,v,s in [(2,1.203,'1,203 s'),(1,1.805,'1,805 s'),(0,2.063,'2,063 s')]:ax.text(v+.05,y,s,va='center',size=16,weight='bold')

fig.text(.66,.493,'C  4B przy pełnym kontekście HA',size=18,weight='bold')
fig.text(.66,.450,'QAIRT / kontekst 4 096:  SKIP',size=16,weight='bold',color='#7961a8')
fig.text(.66,.418,'Wejście ~7 800 tokenów nie mieściło się\nw skonfigurowanym oknie. Brak pomiaru czasu.',size=13,color=MUTED,linespacing=1.5,va='top')
fig.text(.66,.348,'GGUF / kontekst 10 240:  FAIL',size=16,weight='bold',color='#9b522e')
fig.text(.66,.316,'Błąd ładowania: FastRPC mmap / ENOMEM.\nBrak pomiaru czasu inferencji.',size=13,color=MUTED,linespacing=1.5,va='top')
fig.text(.055,.186,'Bez STT, rzeczywistego wykonania narzędzi HA / drugiej rundy LLM i TTS.',size=15,weight='bold')
fig.text(.055,.151,'Zgodność = dokładny tekst / forma, bez niespodziewanego narzędzia, z poprawnym zakończeniem.',size=13)
fig.text(.055,.118,'SKIP nie dowodzi niemożliwości uruchomienia 4B; FAIL dotyczy jednej próby, nie wszystkich konfiguracji.',size=13,color=MUTED)
fig.text(.055,.085,'4B QAIRT (2507) i 4B GGUF to różne checkpointy. Krótkie wejście nie jest testem całego głosu ani pełnego HA.',size=13,color=MUTED)
fig.text(.055,.042,'Źródło: wnioski.md • historyczny benchmark NPU z rezydentnym WhisperSmallNPU; bez pomiarów CPU.',size=12,color=MUTED)
save(fig,'npu-model-comparison')
