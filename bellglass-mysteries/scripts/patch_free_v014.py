"""Bellglass free v0.1.4 release patch, run only against v0.1.2 baseline ZIP."""
import os, io, zipfile, hashlib, fitz
from pathlib import Path

root=Path(__file__).resolve().parents[1]
old=root/"downloads"/"Raincheck_Pin_Free_Tester_v0.1.2.zip"
new=root/"downloads"/"Raincheck_Pin_Free_Tester_v0.1.4.zip"
mail="dlaepdfuf89+bellglass@gmail.com"
base="https://dlaepdfuf89-crypto.github.io/bellglass-mysteries/"
BG=(246/255,248/255,249/255)
NOTE=(232/255,237/255,235/255)
W=(1,1,1)
def edit(p,rect,lines,fill=BG,x=58,y=234,size=11,step=16,bold=False):
    p.add_redact_annot(fitz.Rect(*rect),fill=fill)
    p.apply_redactions(images=0,graphics=0,text=0)
    if isinstance(lines,str):lines=[lines]
    for line in lines:
        assert fitz.get_text_length(line,fontname='hebo' if bold else 'helv',fontsize=size)<p.rect.width-x-30,(line,p.rect)
        p.insert_text((x,y),line,fontname='hebo' if bold else 'helv',fontsize=size,color=(.075,.145,.22))
        y+=step
def mod(doc,name):
    if name=="03_INVESTIGATOR_B.pdf":
        p=doc[0]
        edit(p,(43,123,520,159),"Tea counter receipt",x=44,y=151,size=24,bold=True)
        edit(p,(56,219,565,257),[
          "Jules says the tea receipt puts them away from the booth when",
          "the pin case opened. The printed receipt time is 18:10."
        ],fill=W)
        p=doc[1];dh=p.rect.height-792
        edit(p,(56,679+dh,min(p.rect.width-35,559),699+dh),
          "CASE NOTE Packet contents were not opened for inspection at sign-in.",
          fill=NOTE,x=57,y=690+dh,size=9.1)
        p=doc[2]
        edit(p,(43,123,520,159),"Unsent message draft",x=44,y=151,size=24,bold=True)
        edit(p,(56,219,564,257),[
          "A draft saved in Jules' name reads: The roof leak is getting worse.",
          "They said not to move displays before photos. I should tell someone."
        ],fill=W)
        edit(p,(56,679+dh,min(p.rect.width-35,559),699+dh),
          "CASE NOTE This draft was saved, not sent to the coordinator.",
          fill=NOTE,x=57,y=690+dh,size=9.1)
    if name=="01_START_HERE.pdf":
        p=doc[1]
        p.insert_text((44,510),"HOW TO WRITE YOUR ANSWER",fontsize=9,fontname="hebo")
        p.insert_text((44,530),"Screen users: write on paper or in your phone/computer's basic notes app.",fontsize=10.3)
        p.insert_text((44,545),"The worksheet is a prompt, not a fillable PDF. Both players share one verdict.",fontsize=10.3)
        p.insert_text((44,573),"PRIVATE PLAYTEST FEEDBACK",fontsize=9,fontname="hebo")
        p.insert_text((44,594),mail,fontsize=11,fontname="hebo")
        dh=p.rect.height-792
        edit(p,(55,640+dh,min(p.rect.width-29,565),681+dh),[
          "Unless a device clock is named, times use the fair master clock.",
          "Device-printed times may differ. Keep the answer closed until your verdict."
        ],fill=(228/255,233/255,235/255),x=57,y=657+dh,size=10.3)
    if name=="99_ANSWER_KEY_OPEN_LAST.pdf":
        p=doc[2]
        edit(p,(46,199,565,279),[
          "A01 places key K-1 with Jules 18:06-18:08. A03 keeps Sam on stage",
          "18:06-18:09, two minutes away. B02 logs Jules' packet in the dry-item",
          "drawer at 18:09, labelled with the pin's distinctive triangle and pad.",
          "B03 mentions the leak and order not to touch displays; together these",
          "clues support a rule-breaking protective move."
        ],x=48,y=214,size=11,step=18)
        p=doc[-1]
        p.insert_text((44,569),"SEND YOUR PRIVATE PLAYTEST FEEDBACK",fontsize=9.1,fontname="hebo")
        p.insert_text((44,589),mail,fontsize=11,fontname="hebo")
        p.insert_text((44,611),"Finished or stopped early? Either is useful. Include device, time, the first",fontsize=10)
        p.insert_text((44,626),"sticking point, both players' contributions, and optional-hint use.",fontsize=10)
        p.insert_text((44,665),"Check the current release status (no paid checkout available yet):",fontsize=10)
        p.insert_text((44,682),base,fontsize=9.2)

start="""THE RAINCHECK PIN / START HERE / v0.1.4-QA
A FREE, COMPLETE TWO-ADULT CASE. No payment, signup or host.
1. Unzip once; choose Screen, A4 or USLetter. Use ONE version only.
2. Both read 01_START_HERE.pdf, then privately share 02_INVESTIGATOR_A with A
   and 03_INVESTIGATOR_B with B. Describe clues to each other aloud.
3. Write your verdict in Notes on a phone/computer or on paper.
   04_SHARED_WORKSHEET.pdf has prompts; it is not fillable.
4. If needed, open 06_OPTIONAL_HINT_01.pdf. Open
   99_ANSWER_KEY_OPEN_LAST.pdf ONLY after agreeing a verdict.
5. All times are fair master-clock time unless a device is named.
PRIVATE FEEDBACK: dlaepdfuf89+bellglass@gmail.com
Finished or stopped? Include format/device, preparation minutes,
investigation minutes, first stuck step, A and B contributions, hint use
and where you found this case. See FEEDBACK_SHEET.pdf or the text template.
A different, longer paid case, The Bellglass Interval, is NOT on sale yet.
Check the release status: https://dlaepdfuf89-crypto.github.io/bellglass-mysteries/
Fictional AI-assisted work; human playtime/fairness remain unverified.
Private two-person reading and printing allowed; no resale/redistribution.
"""
reply="""RAINCHECK PIN v0.1.4 — PRIVATE FEEDBACK
To: dlaepdfuf89+bellglass@gmail.com
Two adults?: 
Played on phones, PCs or print?: 
Completed / stopped early / could not start?:
Minutes spent preparing?:
Minutes spent investigating?:
First confusing instruction/exhibit?:
What did A discover?:
What did B discover?:
Did you open the hint?:
Did the solution seem fair?:
What should change?:
Where did you find the case?:
No identifying personal details or public spoilers, please.
"""
def feedback_pdf():
    d=fitz.open();p=d.new_page(width=612,height=792)
    p.draw_rect((0,0,612,85),fill=(.07,.14,.21),color=None)
    p.insert_text((36,50),"BELLGLASS / PRIVATE TWO-PERSON FEEDBACK",fontsize=15,fontname="hebo",color=(1,1,1))
    p.insert_text((36,114),"The Raincheck Pin v0.1.4",fontsize=20,fontname="hebo")
    p.insert_text((36,141),"Complete or stopped early: both are useful. Please do not post spoilers.",fontsize=10.4)
    fields=[
      "Two adult players?","Screen / device / paper format?","Completed / stopped early / unable to start?",
      "Preparation minutes?","Investigation minutes?","First step or exhibit where you got stuck?",
      "What did Player A discover?","What did Player B discover?","Hint used? When?",
      "Did the solution feel fair?","What should change?","Where did you find this?"
    ]
    y=175
    for f in fields:
        p.insert_text((36,y),f,fontsize=10.5,fontname="hebo");p.draw_line((36,y+15),(576,y+15),color=(.77,.8,.82),width=.7);y+=38
    p.insert_text((36,678),"Send your PRIVATE answer to:",fontsize=12,fontname="hebo")
    p.insert_text((36,702),mail,fontsize=12,fontname="hebo")
    p.insert_text((36,735),"Use your email app, a text reply, or a photo of this paper.",fontsize=9.4)
    b=d.tobytes(garbage=4,deflate=True);d.close();return b

with zipfile.ZipFile(old) as zin:
    out=[]
    for n in zin.namelist():
        if n in ("READ_FIRST.txt","README_FIRST.txt","TWO_PERSON_BLIND_TEST_START.pdf","BLIND_PLAYTEST_FEEDBACK.pdf"):
            continue
        raw=zin.read(n)
        if n.endswith(".pdf") and "/" in n and n.split("/")[-1] in ("01_START_HERE.pdf","03_INVESTIGATOR_B.pdf","99_ANSWER_KEY_OPEN_LAST.pdf"):
            d=fitz.open(stream=raw,filetype="pdf")
            mod(d,n.split("/")[-1]);raw=d.tobytes(garbage=4,deflate=True);d.close()
        out.append((n,raw))
out.extend([("START_HERE.txt",start.encode()),("COPY_PASTE_FEEDBACK.txt",reply.encode()),("FEEDBACK_SHEET.pdf",feedback_pdf())])
with zipfile.ZipFile(new,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=7) as z:
    for name,b in out:z.writestr(name,b)
with zipfile.ZipFile(new) as z:
    assert z.testzip() is None
    for variant in ("Screen","A4","USLetter"):
        txt=fitz.open(stream=z.read(variant+"/03_INVESTIGATOR_B.pdf"),filetype="pdf")
        alltext="\n".join(p.get_text() for p in txt)
        for forbidden in ("A paper-thin alibi","case alarm","The disappearance might be","I was trying to protect"):
            assert forbidden not in alltext,(variant,forbidden)
        assert "Unsent message draft" in alltext
        for path in ("01_START_HERE.pdf","99_ANSWER_KEY_OPEN_LAST.pdf"):
            d=fitz.open(stream=z.read(variant+"/"+path),filetype="pdf")
            assert mail in d[-1].get_text()
    assert sum(n.endswith(".pdf") and "/" in n for n in z.namelist())==18
print("RELEASED",new,new.stat().st_size,hashlib.sha256(new.read_bytes()).hexdigest())
