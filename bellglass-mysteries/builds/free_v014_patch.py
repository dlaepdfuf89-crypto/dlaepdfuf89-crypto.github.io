#!/usr/bin/env python3
"""Bellglass Raincheck free release 0.1.4: targeted redactions and one-point feedback."""
from __future__ import annotations
import zipfile,fitz,io,hashlib,re,json,sys,os
from pathlib import Path

BASE=Path(__file__).resolve().parent
OLD=Path(os.environ.get('BELLGLASS_SOURCE_ZIP',str(BASE/'bellglass_project'/'RAINCHECK_PUBLIC_FREE_TESTER_PACK_v0.1.2.zip')))
NEW=Path(os.environ.get('BELLGLASS_OUT_ZIP',str(BASE/'bellglass_project'/'Raincheck_Pin_Free_Tester_v0.1.4.zip')))
EMAIL='dlaepdfuf89+bellglass@gmail.com'
URL='https://dlaepdfuf89-crypto.github.io/bellglass-mysteries/'
G='#12263a';BG=(246/255,248/255,249/255); WHITE=(1,1,1);NOTE=(232/255,237/255,235/255)

def replace_rect(page, rect, newlines, color=BG, fontsize=11, x=None, baseline=None, font='helv', ink=(.075,.145,.22),leading=15):
    """Real PDF redaction, not white covering an invisible, selectable old layer."""
    page.add_redact_annot(rect,fill=color)
    page.apply_redactions(images=0,graphics=0,text=0)
    x=rect.x0+1 if x is None else x
    baseline=rect.y0+fontsize if baseline is None else baseline
    if isinstance(newlines,str): newlines=[newlines]
    max_width=page.rect.width-x-42
    for line in newlines:
        if fitz.get_text_length(line,fontsize=fontsize,fontname=font)>max_width:
            raise ValueError('OVERFLOW '+str((line,max_width)))
        page.insert_text((x,baseline),line,fontname=font,fontsize=fontsize,color=ink,overlay=True)
        baseline+=leading

def span_matches(page,lookup):
    found=[]
    for block in page.get_text('dict')['blocks']:
      for line in block.get('lines',[]):
       for s in line.get('spans',[]):
        if lookup in s['text']:
         found.append(s)
    return found

def amend(doc,name,variant):
    if name=='03_INVESTIGATOR_B.pdf':
      p=doc[0]
      s=span_matches(p,'A paper-thin alibi'); assert len(s)==1
      r=fitz.Rect(43,123,520,159)
      replace_rect(p,r,'Tea counter receipt',fontsize=24,font='hebo',x=44,baseline=151)
      # B01 receipt: no undefined alarm; important device times survive unaltered.
      r=fitz.Rect(56,219,565,257)
      replace_rect(p,r,[
        'Jules says the tea receipt puts them away from the booth when',
        'the pin case opened. The printed receipt time is 18:10.'
      ],color=WHITE,fontsize=11,x=58,baseline=234,leading=16)
      p=doc[1]
      r=fitz.Rect(56,679 + (p.rect.height - 792),min(p.rect.width-35,559),699+(p.rect.height - 792))
      replace_rect(p,r,'CASE NOTE Packet contents were not opened for inspection at sign-in.',color=NOTE,fontsize=9.1,x=57,baseline=690+(p.rect.height - 792))
      p=doc[2]
      # Remove premature explanatory headline.
      for s in span_matches(p,'Why someone stayed quiet'):
       r=fitz.Rect(43,123,520,159)
       replace_rect(p,r,'Unsent message draft',fontsize=24,font='hebo',x=44,baseline=151)
      r=fitz.Rect(56,219,564,257)
      replace_rect(p,r,[
        "A draft saved in Jules' name reads: The roof leak is getting worse.",
        "They said not to move displays before photos. I should tell someone."
      ],color=WHITE,fontsize=11,x=58,baseline=234,leading=16)
      r=fitz.Rect(56,679 + (p.rect.height - 792),min(p.rect.width-35,559),699+(p.rect.height - 792))
      replace_rect(p,r,'CASE NOTE This draft was saved, not sent to the coordinator.',color=NOTE,fontsize=9.1,x=57,baseline=690+(p.rect.height - 792))
    elif name=='01_START_HERE.pdf':
      p=doc[1]
      p.insert_text((44,510),'HOW TO WRITE YOUR ANSWER',fontsize=9,fontname='hebo',color=(.45,.27,.12))
      p.insert_text((44,530),"Screen users: write on paper or in your phone/computer's basic notes app.",fontsize=10.3,fontname='helv',color=(.08,.16,.24))
      p.insert_text((44,545),'The worksheet is a prompt, not a fillable PDF. Both players share one verdict.',fontsize=10.3,fontname='helv',color=(.08,.16,.24))
      p.insert_text((44,573),'PRIVATE PLAYTEST FEEDBACK',fontsize=9,fontname='hebo',color=(.45,.27,.12))
      p.insert_text((44,594),EMAIL,fontsize=11,fontname='hebo',color=(.08,.16,.24))
      # Replace old redundant paragraph in bottom callout with clock convention.
      r=fitz.Rect(55,640+(p.rect.height-792),min(p.rect.width-29,565),681+(p.rect.height-792))
      replace_rect(p,r,[
       'Unless a device clock is named, times use the fair master clock.',
       'Device-printed times may differ. Keep the answer closed until your verdict.'
      ],color=(228/255,233/255,235/255),fontsize=10.3,x=57,baseline=657+(p.rect.height-792),leading=16)
    elif name=='99_ANSWER_KEY_OPEN_LAST.pdf':
      p=doc[-1]
      p.insert_text((44,569),'SEND YOUR PRIVATE PLAYTEST FEEDBACK',fontsize=9.1,fontname='hebo',color=(.45,.27,.12))
      p.insert_text((44,589),EMAIL,fontsize=11,fontname='hebo',color=(.08,.16,.24))
      p.insert_text((44,611),'Finished or stopped early? Either is useful. Include device, time, the first',fontsize=10,fontname='helv',color=(.08,.16,.24))
      p.insert_text((44,626),"sticking point, both players' contributions, and optional-hint use.",fontsize=10,fontname='helv',color=(.08,.16,.24))
      p.insert_text((44,665),'Check the current release status (no paid checkout available yet):',fontsize=10,fontname='helv',color=(.08,.16,.24))
      p.insert_text((44,682),URL,fontsize=9.2,fontname='helv',color=(.08,.16,.24))
      # Restore answer-page alignment with the revised unsent B03 draft.
      p=doc[2]
      r=fitz.Rect(46,199,565,279)
      replace_rect(p,r,[
       "A01 places key K-1 with Jules 18:06-18:08. A03 keeps Sam on stage",
       "18:06-18:09, two minutes away. B02 logs Jules' packet in the dry-item",
       "drawer at 18:09, labelled with the pin's distinctive triangle and pad.",
       "B03 mentions the leak and order not to touch displays; together these",
       "clues support a rule-breaking protective move."
      ],color=BG,fontsize=11,x=48,baseline=214,leading=18)

def build_feedback_pdf()->bytes:
 d=fitz.open();p=d.new_page(width=612,height=792)
 p.draw_rect(fitz.Rect(0,0,612,82),color=None,fill=(.074,.14,.21));
 p.insert_text((38,45),'BELLGLASS / PRIVATE PLAYTEST',fontsize=14,fontname='hebo',color=(1,1,1))
 p.insert_text((38,112),'TWO-PERSON FEEDBACK',fontsize=22,fontname='hebo',color=(.075,.15,.22))
 p.insert_text((38,138),'Complete or unfinished: both experiences matter. Do not post spoilers publicly.',fontsize=10.5,color=(.2,.27,.34))
 lines=[
 ('1. Case version','Raincheck Pin v0.1.4 / 2026-10-14'),
 ('2. Both players adults?','Yes / No / Prefer not to say'),
 ('3. Play format','2 phones / 2 PCs / screen + print / other'),
 ('4. Outcome','Completed / stopped early / could not start'),
 ('5. Preparation minutes','____   Actual investigation minutes: ____'),
 ('6. First point where you got stuck','Exhibit ID / step: ______________________________'),
 ('7. Which clue did Player A contribute?','___________________________________________'),
 ('8. Which clue did Player B contribute?','___________________________________________'),
 ('9. Optional hint used?','No / Yes; before / after getting stuck'),
 ('10. Was your verdict supported?','Yes / Somewhat / No / Not reached'),
 ('11. What would you change?','___________________________________________'),
 ('12. Where did you find this case?','Reddit / itch / search / friend / other')]
 y=175
 for label,pref in lines:
  p.insert_text((38,y),label,fontsize=10.5,fontname='hebo',color=(.075,.15,.22))
  p.insert_text((270,y),pref,fontsize=9.2,color=(.21,.30,.37))
  p.draw_line((38,y+8),(574,y+8),color=(.82,.85,.87),width=.5)
  y+=39
 p.insert_text((38,675),'PRIVATE RETURN ADDRESS',fontsize=10,fontname='hebo',color=(.45,.27,.12))
 p.insert_text((38,695),EMAIL,fontsize=12,fontname='hebo',color=(.075,.15,.22))
 p.insert_text((38,720),'You can reply in an email or photograph/scan this sheet. No account on GitHub needed.',fontsize=9.4,color=(.25,.32,.39))
 p.insert_text((38,737),'Avoid real names or personal details. This PDF is not a fillable form.',fontsize=9.2,color=(.25,.32,.39))
 out=d.tobytes(garbage=4,deflate=True);d.close();return out

README='''THE RAINCHECK PIN — START HERE (v0.1.4-QA)
FREE, COMPLETE, ENGLISH-LANGUAGE TWO-ADULT MYSTERY — NO PURCHASE OR ACCOUNT NEEDED.

1. Unzip ONCE. Choose Screen for phones/computers, A4 or USLetter for printing.
   All three versions have identical evidence. You only need ONE version.
2. Both open 01_START_HERE.pdf. Send Screen/02_INVESTIGATOR_A.pdf to Player A;
   Screen/03_INVESTIGATOR_B.pdf to Player B (or the matching A4/USLetter files).
   Do not read your partner's file. Share clues aloud.
3. Write your joint verdict on paper or in your phone/computer's basic Notes app.
   04_SHARED_WORKSHEET.pdf gives prompts but is NOT an editable form.
4. Only if stuck, open 06_OPTIONAL_HINT_01.pdf. Agree on a verdict before opening
   99_ANSWER_KEY_OPEN_LAST.pdf. Its final page explains next steps.
5. Unless a device clock is named, event times follow the fair master clock.
   Device-printed times may differ.

PRIVATE PLAYTEST FEEDBACK: dlaepdfuf89+bellglass@gmail.com
Please send feedback whether you completed or stopped early. Include:
- Raincheck v0.1.4; two adult players, playing format/device/print;
- Start/preparation minutes and play minutes separately;
- Complete, stopped early (where), or unable to start;
- First confusing exhibit; what A and B each discovered;
- Hint used (yes/no), fairness and one change you'd make;
- Where you found us. Do not send identifying personal details or public spoilers.
You can type an email or send a photographed printable FEEDBACK_SHEET.pdf.

NEXT FULL CASE: The Bellglass Interval is a DIFFERENT, longer museum investigation,
planned at USD $12, but it is NOT for sale yet. Check the release status:
https://dlaepdfuf89-crypto.github.io/bellglass-mysteries/

Use the free case for two-person household play only; no resale or redistribution.
Story and design made with generative-AI assistance; human playtime/fairness unverified.
'''

REPLY='''RAINCHECK PIN — COPY/PASTE PRIVATE FEEDBACK (v0.1.4)
To: dlaepdfuf89+bellglass@gmail.com
Subject: Raincheck Pin v0.1.4 two-person feedback

Two adult players (Y/N):
Screens/devices or printed format:
Completed / stopped early / could not start:
Preparation time (minutes):
Investigation time (minutes):
First place you got stuck (file / exhibit):
What did Player A discover?
What did Player B discover?
Optional hint used? When?
Fair solution / confusing step:
What would you change?
Where did you find this free case? (Reddit/itch/search/friend/other):

Please avoid including spoilers in public posts, and don't include unnecessary personal details.
'''

def run():
 assert OLD.is_file()
 out=[]
 with zipfile.ZipFile(OLD) as zin:
  for info in zin.infolist():
   n=info.filename
   if n in ('READ_FIRST.txt','README_FIRST.txt','TWO_PERSON_BLIND_TEST_START.pdf','BLIND_PLAYTEST_FEEDBACK.pdf'):
    continue
   b=zin.read(n)
   if n.endswith('.pdf') and '/' in n and n.split('/')[-1] in ('01_START_HERE.pdf','03_INVESTIGATOR_B.pdf','99_ANSWER_KEY_OPEN_LAST.pdf'):
    d=fitz.open(stream=b,filetype='pdf');amend(d,n.split('/')[-1],n.split('/')[0]);b=d.tobytes(garbage=4,deflate=True);d.close()
   out.append((n,b))
 out.extend([('START_HERE.txt',README.encode()),('COPY_PASTE_FEEDBACK.txt',REPLY.encode()),('FEEDBACK_SHEET.pdf',build_feedback_pdf())])
 with zipfile.ZipFile(NEW,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=7) as zout:
  for name,content in out:
   zout.writestr(name,content)
 with zipfile.ZipFile(NEW) as z:
  assert z.testzip() is None
  for v in ['Screen','A4','USLetter']:
   a=fitz.open(stream=z.read(v+'/03_INVESTIGATOR_B.pdf'),filetype='pdf')
   txt='\n'.join(p.get_text() for p in a)
   assert 'A paper-thin alibi' not in txt and 'case alarm' not in txt and 'The disappearance might be' not in txt
   assert 'Tea counter receipt' in txt and 'Packet contents were not opened' in txt
   assert 'I was trying to protect' not in txt
   assert 'Unsent message draft' in txt
   a.close()
   b=fitz.open(stream=z.read(v+'/01_START_HERE.pdf'),filetype='pdf')
   assert EMAIL in b[-1].get_text()
   assert 'fair master clock' in b[-1].get_text()
   b.close()
   c=fitz.open(stream=z.read(v+'/99_ANSWER_KEY_OPEN_LAST.pdf'),filetype='pdf')
   assert EMAIL in c[-1].get_text()
   c.close()
 sha=hashlib.sha256(NEW.read_bytes()).hexdigest()
 print(json.dumps({'result':str(NEW),'bytes':NEW.stat().st_size,'sha256':sha,'count':len(out),'names':[n for n,b in out]},indent=2))

if __name__=='__main__':run()