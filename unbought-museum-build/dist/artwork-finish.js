// Handmade high-frequency material details laid over the established 20 vector silhouettes.
// Static design-only artwork. No product photographs, user text, URLs or dynamic identifiers.
// Every overlay shares the native 180x170 stage and the stored record's original material palette.
const OVERLAYS=Object.freeze({
 shoes:Object.freeze({
  classic:`<path d="M34 111c9-5 15-13 19-21M98 93c18 11 31 13 52 17" stroke="#fffaf1" stroke-width="2.3" stroke-linecap="round" opacity=".55" fill="none"/>
<path d="M30 126h121" stroke="#fff" stroke-width="1.6" opacity=".72"/>
<path d="M38 135c31 2 74 2 103 0" stroke="#796654" stroke-width="1.3" stroke-dasharray="2 3.4" opacity=".5" fill="none"/>
<path d="M43 95c9-1 15-7 17-13M100 100c15 7 27 10 43 10" stroke="#714d3c" stroke-width="1.5" stroke-dasharray="2.3 3" opacity=".42" fill="none"/>
<circle cx="70" cy="77" r="1.8" fill="#7b665a"/><circle cx="66" cy="86" r="1.8" fill="#7b665a"/><circle cx="63" cy="95" r="1.8" fill="#7b665a"/>
<path d="M121 108c12 0 21 2 27 5" stroke="#fff6e7" stroke-width="2.1" opacity=".62" stroke-linecap="round" fill="none"/>`,
  loafer:`<path d="M32 109c9-4 16-7 22-12m66 10c17 2 28 6 33 13" stroke="#fffcf1" stroke-width="2" opacity=".55" fill="none"/>
<path d="M66 101c15-6 30-7 44-4" stroke="#f8e7ce" stroke-width="2" opacity=".75" fill="none"/>
<path d="M32 133h119" stroke="#d6c8b2" stroke-width="2" opacity=".73"/>
<path d="M54 94c3-4 6-7 10-10" stroke="#6e4d3e" stroke-width="1.4" stroke-dasharray="2 3" opacity=".65"/>`,
  slipper:`<path d="M54 91c28-13 50-13 72-5" stroke="#fff5df" stroke-width="2.5" opacity=".64" fill="none"/>
<path d="M30 125c34 6 83 8 121 0" stroke="#655d55" stroke-width="2" opacity=".45" fill="none"/>
<path d="M36 135c33 4 76 4 112-1" stroke="#fff" stroke-width="1.6" opacity=".73" fill="none"/>`,
  boot:`<path d="M63 34h32" stroke="#fff" stroke-width="2" opacity=".52"/>
<path d="M61 90c4 8 10 13 19 16" stroke="#7b5146" stroke-width="2" stroke-dasharray="2 4" opacity=".7" fill="none"/>
<path d="M33 131h122" stroke="#f7efdf" stroke-width="2" opacity=".8"/>
<path d="M106 111c17 2 30 5 43 12" stroke="#f2d5b7" stroke-width="2.5" opacity=".5" fill="none"/>`
 }),
 bag:Object.freeze({
  classic:`<path d="M48 69c10-4 23-5 37-5" stroke="#fff1d7" stroke-width="2" opacity=".48" fill="none"/>
<path d="M48 121h83" stroke="#573d36" stroke-width="1.1" stroke-dasharray="2 3" opacity=".45"/>
<circle cx="56" cy="112" r="1.7" fill="#e8c88b"/><circle cx="127" cy="112" r="1.7" fill="#e8c88b"/>
<path d="M75 89c14 3 27 3 39 0" stroke="#fff7dc" stroke-width="2" opacity=".56" fill="none"/>`,
  backpack:`<path d="M53 71c2-12 9-19 23-23" stroke="#fff9e9" stroke-width="2.5" opacity=".46" fill="none"/>
<path d="M52 126h75" stroke="#785c4c" stroke-width="1.4" opacity=".55" stroke-dasharray="3 3"/>
<path d="M57 96q35-8 66 0" stroke="#fff5df" stroke-width="1.8" opacity=".42" fill="none"/>
<circle cx="49" cy="133" r="2.3" fill="#e5c18c"/><circle cx="132" cy="133" r="2.3" fill="#e5c18c"/>`,
  suitcase:`<path d="M53 54h69" stroke="#fff1d9" stroke-width="2.5" opacity=".42" fill="none"/>
<path d="M53 126h74" stroke="#624737" stroke-width="1.5" stroke-dasharray="2.5 4" opacity=".48"/>
<circle cx="62" cy="128" r="2" fill="#f2d29a"/><circle cx="118" cy="128" r="2" fill="#f2d29a"/>
<path d="M82 88h17" stroke="#f7e8d2" stroke-width="2" opacity=".55"/>`
 }),
 tech:Object.freeze({
  classic:`<path d="M65 28v93" stroke="#fff" stroke-width="2.5" opacity=".21"/>
<path d="M116 40v90" stroke="#e0fffa" stroke-width="1.9" opacity=".17"/>
<path d="M64 128h55" stroke="#fffef3" stroke-width="2" opacity=".23" fill="none"/>
<circle cx="117" cy="33" r="2" fill="#e6f9ea" opacity=".7"/>`,
  headphones:`<path d="M51 54c9-19 22-28 40-29" stroke="#f1faf3" stroke-width="3" opacity=".36" stroke-linecap="round" fill="none"/>
<path d="M41 97v25m91-24v25" stroke="#d6eef0" stroke-width="2.4" opacity=".47"/>
<path d="M39 128c5 3 9 3 13 1m81-1c4 2 8 2 12-1" stroke="#f6f7e8" stroke-width="2" opacity=".44" fill="none"/>`,
  camera:`<path d="M31 81h14M135 81h14" stroke="#e9fcf9" stroke-width="2.3" stroke-linecap="round" opacity=".54"/>
<circle cx="92" cy="99" r="32" fill="none" stroke="#111d29" stroke-width="2.2" opacity=".8"/>
<circle cx="92" cy="99" r="30" fill="none" stroke="#d2f4e9" stroke-width="1.5" opacity=".55"/>
<circle cx="92" cy="99" r="21" fill="none" stroke="#a4d4c8" stroke-width="4" opacity=".42"/>
<circle cx="92" cy="99" r="11" fill="#102f43" opacity=".7"/>
<path d="m81 87 10-8m3 16 8-6" stroke="#b1e1dc" stroke-width="3.2" stroke-linecap="round" opacity=".68" fill="none"/>
<circle cx="97" cy="104" r="3.5" fill="#5a8f92" opacity=".45"/>
<path d="M41 69h19m65 0h17" stroke="#fff" stroke-width="2.1" opacity=".43" fill="none"/>
<circle cx="141" cy="76" r="3" fill="#ccdfcc" opacity=".7"/>
<path d="M39 131h102" stroke="#091d25" stroke-width="2.2" opacity=".35"/>`,
  laptop:`<path d="M53 35v69" stroke="#e0fff8" stroke-width="2" opacity=".34"/>
<path d="M56 113h71" stroke="#fff" stroke-width="1.6" opacity=".4"/>
<path d="M36 133h113" stroke="#f0f8e8" stroke-width="2" opacity=".53"/>
<path d="M32 139h122" stroke="#293d45" stroke-width="2" opacity=".45"/>`
 }),
 home:Object.freeze({
  classic:`<path d="M70 83c20 7 34 7 48 1" stroke="#fff8ec" stroke-width="2" opacity=".54" fill="none"/>
<path d="M80 127c13 4 24 2 34-1" stroke="#7f624d" stroke-width="1.4" opacity=".48" stroke-dasharray="2 3" fill="none"/>
<path d="M62 45c5 9 11 15 19 18" stroke="#cfe2ba" stroke-width="1.6" opacity=".67" fill="none"/>`,
  lamp:`<path d="M62 59 76 30h32" stroke="#fff7da" stroke-width="2.3" opacity=".7" stroke-linecap="round" fill="none"/>
<path d="M54 76c17 13 63 13 76 0" stroke="#fffbcd" stroke-width="4" opacity=".6" fill="none"/>
<path d="M86 81v50" stroke="#fff4dc" stroke-width="2.5" opacity=".56"/>
<ellipse cx="91" cy="73" rx="26" ry="5" fill="#fff7c4" opacity=".33"/>
<path d="M68 138h46" stroke="#fffaf0" stroke-width="2.3" opacity=".47"/>`,
  chair:`<path d="M58 42q28-13 65 0" stroke="#fff3dd" stroke-width="2.6" opacity=".6" fill="none"/>
<path d="M49 116h90" stroke="#e9d3b7" stroke-width="2.3" opacity=".42"/>
<path d="M62 98h60" stroke="#bd9b78" stroke-width="1.7" opacity=".44" fill="none"/>`
 }),
 coffee:Object.freeze({
  classic:`<path d="M63 92v28" stroke="#fffaf0" stroke-width="2.6" opacity=".58"/>
<path d="M74 134q15 4 28 0" stroke="#9d866d" stroke-width="1.3" opacity=".6" fill="none"/>
<path d="M54 67q30-15 62 0" stroke="#fff0da" stroke-width="2" opacity=".4" fill="none"/>`,
  tumbler:`<path d="M61 47h61" stroke="#f6f3e7" stroke-width="2.1" opacity=".55"/>
<path d="M76 55v68" stroke="#fffefa" stroke-width="3" opacity=".47"/>
<path d="M110 57v55" stroke="#937861" stroke-width="1.5" opacity=".3"/>
<path d="M71 90h43" stroke="#fff8e3" stroke-width="2" opacity=".44"/>
<ellipse cx="90" cy="135" rx="24" ry="3" fill="#766550" opacity=".18"/>`,
  kettle:`<path d="M60 82c2-15 12-25 28-28" stroke="#fffdf0" stroke-width="3" opacity=".59" fill="none"/>
<path d="M65 110q28 8 56 0" stroke="#e7ceae" stroke-width="1.8" opacity=".53" fill="none"/>
<path d="M63 124h61" stroke="#6b5144" stroke-width="1.7" opacity=".3"/>
<circle cx="92" cy="24" r="3" fill="#fff3da" opacity=".46"/>`
 }),
 other:Object.freeze({
  classic:`<path d="m47 66 42 25 48-24" stroke="#fff8e5" stroke-width="2.2" opacity=".44" fill="none"/>
<path d="M49 106 84 125" stroke="#f1d5b3" stroke-width="1.6" opacity=".48"/>
<path d="m100 131 28-16" stroke="#f6e6c9" stroke-width="1.7" opacity=".58"/>`,
  book:`<path d="M41 58q21-4 39 4m-39 55q20-2 39 5" stroke="#f9eedb" stroke-width="1.7" opacity=".56" fill="none"/>
<path d="M103 62q20-6 36-3" stroke="#fff9e8" stroke-width="1.7" opacity=".57" fill="none"/>
<path d="M90 55v76" stroke="#fff4dc" stroke-width="1.6" opacity=".57" fill="none"/>
<path d="M48 112q16-2 29 3m29-6q12-5 24-4" stroke="#977957" stroke-width="1.3" opacity=".35" fill="none"/>`,
  jewelry:`<path d="m91 35 11 18-11 14-11-14Z" fill="#fffce3" opacity=".27"/>
<path d="m70 51 21-19 21 19" stroke="#fffce2" stroke-width="2.3" opacity=".63" fill="none"/>
<path d="m79 103c0-12 4-19 12-25" stroke="#fff2d2" stroke-width="2.5" opacity=".53" fill="none"/>
<path d="M114 108c-4 17-13 25-23 27" stroke="#eed6a3" stroke-width="1.8" opacity=".62" fill="none"/>`
 })
});
const EXTRAS=Object.freeze({
 bag:Object.freeze({
  wallet:`<path d="M36 76h108" stroke="#f9e9d0" stroke-width="2" opacity=".5"/>
<path d="M43 124h99" stroke="#614637" stroke-width="1.6" stroke-dasharray="2 3" opacity=".43"/>
<path d="M119 91h14" stroke="#fff4d9" stroke-width="2" opacity=".62"/>
<circle cx="43" cy="70" r="2" fill="#f3d6a2"/>`
 }),
 tech:Object.freeze({
  watch:`<path d="M63 58v55" stroke="#f7fffa" stroke-width="2.4" opacity=".49"/>
<path d="M75 21h35" stroke="#d6eee8" stroke-width="2" opacity=".47"/>
<circle cx="92" cy="89" r="23" fill="none" stroke="#f6fff9" stroke-width="1.6" opacity=".4"/>
<path d="M83 120h28" stroke="#c5eee2" stroke-width="2.4" opacity=".57"/>`
 }),
 home:Object.freeze({
  desk:`<path d="M29 90h127" stroke="#fff1d9" stroke-width="2.3" opacity=".65"/>
<path d="M39 112v30m105-30v30" stroke="#faf2d9" stroke-width="2" opacity=".45"/>
<path d="M111 67h25" stroke="#f8e8d5" stroke-width="1.7" opacity=".55"/>`,
  sofa:`<path d="M45 64q45-7 89 0" stroke="#fff8e9" stroke-width="2.4" opacity=".49" fill="none"/>
<path d="M45 117h91" stroke="#fff5da" stroke-width="2" opacity=".48"/>
<path d="M52 131h76" stroke="#8b6950" stroke-width="1.5" opacity=".4"/>`,
  mirror:`<path d="M62 52 99 29" stroke="#fff" stroke-width="3" opacity=".49" fill="none"/>
<path d="M61 98q31 24 64 0" stroke="#bd9c79" stroke-width="2" opacity=".47" fill="none"/>
<path d="M67 141h52" stroke="#fff5df" stroke-width="2" opacity=".64"/>`
 })
});
export function sculptureFineDetail(group,shape){
 if(Object.hasOwn(EXTRAS[group]??{},shape))return EXTRAS[group][shape];
 const groupItems=Object.hasOwn(OVERLAYS,group)?OVERLAYS[group]:OVERLAYS.other;
 return Object.hasOwn(groupItems,shape)?groupItems[shape]:groupItems.classic;
}
