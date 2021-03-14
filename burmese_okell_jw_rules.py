#!/usr/local/bin/python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

SHORT_RULE_SET = """\
$consonants = [\u1000-\u1021];
# ($consonants) ြောင် → | $1 yaung;
($consonants) \u103C\u1031\u102C\u1004\u103A  → | $1 yaung;
"""

TRANSLIT_MY_OKELL_JW = u"""\
# Burmese to Okell transliteration, with modifications by Julian Wheatley

# Dependent vowel signs
$vs_AA = \u102B;
$vs_aa = \u102C;
$vs_i = \u102D;
$vs_ii = \u102E;
$vs_u = \u102F;
$vs_uu = \u1030;
$vs_e = \u1031;
$vs_ai = \u1032;

# Various signs
$anusvara = \u1036;
$visarga = \u1038;
$virama = \u1039;
$asat = \u103A;

# Dependent (medial) consonant signs
$med_y = \u103B;
$med_r = \u103C;
$med_w = \u103D;
$med_h = \u103E;

# Independent letters and letter-like punctuation symbols
$independent = [\u1000-\u102A \u103F \u104C-\u104F \u1050-\u1055];

$creaky = \u0330;
$high = \u0301;
$low = \u0300;
#$coda = [$creaky $high $low ɴ ou' a];  # TODO: remove if unused

#
# Preprocessing
#

::NFC;

# Replace U+102B TALL AA with U+102C AA. Their pronunciation is identical.
$vs_AA → $vs_aa;

# Unstack kinzi (င် plus U+1039 VIRAMA) into plain င်.
# Hmm, what would happen if the syllable ending in kinzi had non-low tone?
င် $virama → င်;

# Unstack everything else, i.e. replace U+1039 VIRAMA with U+103A ASAT.
$virama → $asat;

# Unstack U+103F GREAT SA.
ဿ → သ်သ;

# Insert a syllable boundary marker /./ before every independent letter.
::Null;
[^.$] { } $independent ([\u1037\u103B-\u103E])* [^\u103A] → .;

# Insert default inherent vowel: /a̰/ at the end, /a/ everywhere else.
::Null;
([\u1000-\u1021\u103F] [\u103B-\u103E]*) } [$] → $1 a $creaky;
([\u1000-\u1021\u103F] [\u103B-\u103E]*) } .  → $1 a;

# Allow for additional coda consonants.
#
# This only covers a few of the cases in which full coda consonants
# can appear in loanwords. The general situation is somewhat rare and
# is more easily dealt with in a formalism that can impose structural
# constraints on syllables more easily.
::Null;
$asat ($visarga)? [\u1000-\u102A] { $asat → ;

# Deal with ၎င်း early.
၎င်း → la.ɡa $high ʊ̯;

#
# Rhymes
#

::Null;

က် → ehou';

ဂ် → ehou';  # in မဂ္ဂဇင်း ~ မဂ်ဂဇင်း /mɛou'.ɡa.zɪ́h/

င့် → ɪ $creaky ɴ;
င်း → ɪ $high ɴ;
င် → ɪ $low ɴ;

စ် → ɪou';  # maybe sometimes /eɪ̯ou'/

ဉ့် → ɪ $creaky ɴ;
ဉ်း → ɪ $high ɴ;
ဉ် → ɪ $low ɴ;

ည့် → e $creaky h
ည်း → e $high h;
ည် → e $low h;

ဏ့် → a $creaky ɴ;
ဏ်း → a $high ɴ;
ဏ် → a $low ɴ;

တ် → aou';

န့် → a $creaky ɴ;
န်း → a $high ɴ;
န် → a $low ɴ;

ပ် → aou';

မ့် → a $creaky ɴ;
မ်း → a $high ɴ;
မ် → a $low ɴ;

ယ့် → e $creaky h;
ယ်း → e $high h ;
ယ် → e $low h;

သ် → aou';

$vs_aa ဉ့် → ɪ $creaky ɴ;
$vs_aa ဉ်း → ɪ $high ɴ;
$vs_aa ဉ် → ɪ $low ɴ;
$vs_aa တ် → aou';
$vs_aa ဏ့် → a $creaky ɴ;
$vs_aa ဏ်း → a $high ɴ;
$vs_aa ဏ် → a $low ɴ;
$vs_aa န့် → a $creaky ɴ;
$vs_aa န်း → a $high ɴ;
$vs_aa န် → a $low ɴ;
$vs_aa ပ် → aou';  # in ကလာပ်စည်း /ka.laou'.sɛ́/ (club cell)
$vs_aa ယ့် → e $creaky h;
$vs_aa ယ်း → e $high h;
$vs_aa ယ် → e $low h;
$vs_aa ့ → a $creaky;  # redundant creaky tone
$vs_aa း → a $high;
$vs_aa → a $low;

$vs_i က် → eɪ̯ou';
$vs_i စ် → eɪ̯ou';
$vs_i တ် → eɪ̯ou';
$vs_i န့် → ei $creaky ɪ̯h;
$vs_i န်း → ei $high ɪ̯h;
$vs_i န် → ei $low ɪ̯h;
$vs_i ပ် → eɪ̯ou';
$vs_i မ့် → ei $creaky ɪ̯h;
$vs_i မ်း → ei $high ɪ̯h;
$vs_i မ် → ei $low ɪ̯h;
$vs_i $vs_u က် → aɪ̯ou';
$vs_i $vs_u င့် → a $creaky ɪ̯h;
$vs_i $vs_u င်း → a $high ɪ̯h;
$vs_i $vs_u င် → a $low ɪ̯h;
$vs_i $vs_u ဏ့် → a $creaky ɪ̯h;
$vs_i $vs_u ဏ်း → a $high ɪ̯h;
$vs_i $vs_u ဏ် → a $low ɪ̯h;
$vs_i $vs_u ယ့် → ou $creaky;
$vs_i $vs_u ယ်း → ou $high;
$vs_i $vs_u ယ် → ou $low;  # in ကိုယ် /kò/
$vs_i $vs_u ့ → ou $creaky;
$vs_i $vs_u း → ou $high;
$vs_i $vs_u → ou $low;
$vs_i $anusvara ့ → ei $creaky ɪ̯h;
$vs_i $anusvara း → ei $high ɪ̯h;
$vs_i $anusvara → ei $low ɪ̯h;
$vs_i → i $creaky;

$vs_ii ့ → i $creaky;  # this does not usually occur
$vs_ii း → i $high;
$vs_ii → i $low;


$vs_u က် → ou̯ou';
$vs_u ဂ် → ou̯ou';
$vs_u ဏ့် → ou $creaky ʊ̯h;
$vs_u ဏ်း → ou $high ʊ̯h;
$vs_u ဏ် → ou $low ʊ̯h;
$vs_u တ် → ou̯ou';
$vs_u န့် → ou $creaky ʊ̯h;
$vs_u န်း → ou $high ʊ̯h;
$vs_u န် → ou $low ʊ̯h;
$vs_u ပ် → ou̯ou';
$vs_u မ့် → ou $creaky ʊ̯h;
$vs_u မ်း → ou $high ʊ̯h;
$vs_u မ် → ou $low ʊ̯h;
$vs_u $anusvara ့ → ou $creaky ʊ̯h;
$vs_u $anusvara း → ou $high ʊ̯h;
$vs_u $anusvara → ou $low ʊ̯h;
$vs_u → u $creaky;

$vs_uu ့ → u $creaky;  # this does not usually occur
$vs_uu း → u $high;
$vs_uu → u $low;

$vs_e တ် → ɪou';
$vs_e $vs_aa က် → au̯ou';
$vs_e $vs_aa င့် → a $creaky ʊ̯h;
$vs_e $vs_aa င်း → a $high ʊ̯h;
$vs_e $vs_aa င် → a $low ʊ̯h;
$vs_e $vs_aa ့ → aq $creaky;
$vs_e $vs_aa း → aq $high;  # redundant high tone; this does not usually occur
$vs_e $vs_aa ် → a $low w;
$vs_e $vs_aa → a $high w;
$vs_e ့ → ei $creaky;
$vs_e း → ei $high;
$vs_e → ei $low;

# $vs_ai ့ → e $creaky h;
# $vs_ai း → e $high h;  # redundant high tone; this does not usually occur
# $vs_ai → e $high h;
\u1032 ့ → e $creaky h;
\u1032 း → e $high h;  # redundant high tone; this does not usually occur
\u1032 → e $high h;


$anusvara ့ → a $creaky ɴ;
$anusvara း → a $high ɴ;
$anusvara → a $low ɴ;

$med_w တ် → ʊou';
$med_w န့် → ʊ $creaky ɴ;
$med_w န်း → ʊ $high ɴ;
$med_w န် → ʊ $low ɴ;
$med_w ပ် → ʊou';
$med_w မ့် → ʊ $creaky ɴ;
$med_w မ်း → ʊ $high ɴ;
$med_w မ် → ʊ $low ɴ;

#
# Medials
#

::Null;

# Palatalization of the velar stops before MEDIAL YA and MEDIAL RA:
# velar + /j/ ==> modern palatals.

ကျ → c
ချ → ch;
# d͡ʑ;
ဂျ → j;
ဃျ → j;  # d͡ʑ;

ကြ → c;
ခြ → ch;
ဂြ → d͡ʑ;
ဃြ → d͡ʑ;

# Remove redundant MEDIAL YA and MEDIAL RA after initial YA.
ယ { [$med_y $med_r] → ;

# Reorder the medials so that U+103E SIGN MEDIAL HA comes before any
# other medials.

# First, push U+103E MEDIAL HA before U+103D MEDIAL WA.
\u103D \u103E → \u103E \u103D;
::Null;
# Now MEDIAL WA comes last.

# Produce the palatal ʃ sh- from (SA|LA)+YA+HA.
သျှ → sh;
လျှ → sh;

# Second, push U+103E MEDIAL HA before U+103C MEDIAL RA.
\u103C \u103E → \u103E \u103C;
::Null;

# Finally, push U+103E MEDIAL HA before U+103B MEDIAL YA.
\u103B \u103E → \u103E \u103B;
::Null;

# Consume MEDIAL HA and apply devoicing.

ငှ → hng;
ဉှ → hny;
ညှ → hny;
ဏှ → hn;
နှ → hn;
မှ → hm;
ယှ → sh;
ရှ → sh;
လှ → hl;
ဝှ → w̥;
ဠှ → hl;

# Drop any remaining U+103E MEDIAL HA.
\u103E → ;

# Simplify medial cluster /jw/ to /w/, i.e. drop U+103B MEDIAL YA and
# U+103C MEDIAL RA before U+103D MEDIAL WA.  # TODO: revisit this
\u103B } \u103D → ;
\u103C } \u103D → ;

\u103B → y;  #j;
\u103C → y;  #j;
\u103D → w;

#
# Initials
#

# Velars
က → k;
ခ → kʰ;
ဂ → ɡ;
ဃ → ɡ;
င → ng;

# Historic palatals
စ → s;
ဆ → hs;
ဇ → z;
ဈ → z;
ဉ → ny;
ည → ny;

# Alveolars
ဋ → t;
ဌ → ht;
ဍ → d;
ဎ → d;
ဏ → n;

# Historic dentals ==> alveolars
တ → t;
ထ → ht;
ဒ → d;
ဓ → d;
န → n;

# Labials
ပ → p;
ဖ → hp;
ဗ → b;
ဘ → b;
မ → m;

# Other letters
ယ → y;
# historic /r/
ရ → y;
လ် → ;  # final, typically not pronounced in native words
လ → l;
ဝ → w;
သ → dh; # historic /s/ ==> modern dental
ဟ → h;
ဠ → l;
အ → ou';

# Independent vowels

ဣ့ → ou'ḭ;  # redundant creaky tone; this does not usually occur
ဣး → ou'í;  # this does not usually occur
ဣ → ou'ḭ;

ဤ့ → ou'ḭ;  # this does not usually occur
ဤး → ou'í;  # this does not usually occur
ဤ → ou'ì;

ဥ့ → ou'ṵ;  # redundant creaky tone; this does not usually occur
ဥး → ou'ú;  # this does not usually occur
ဥ → ou'ṵ;

ဦ့ → ou'ṵ;  # this does not usually occur
ဦး → ou'ú;
ဦ → ou'ù;

ဧ့ → ou'ḛ;  # this does not usually occur
ဧး → ou'é;
ဧ → ou'è;

ဩ့ → ou'aq̰;  # this does not usually occur
ဩး → ou'aq́;  # redundant high tone; this does not usually occur
ဩ → ou'aq́;

ဪ့ → ou'aq̰;  # this does not usually occur
ဪး → ou'aq́;  # this does not usually occur
ဪ → ou'aq̀;

# Various signs

၌ → n̥aɪ̯ou';
၍ → jwḛ;
# ၎င်း was handled earlier.
၏ → ou'ḭ;

#
# Postprocessing
#

# Delete any remaining U+103A ASAT.
$asat → ;

# Delete zero-width space, non-joiner, joiner.
[\u200B-\u200D] → ;

::NFC;
"""
