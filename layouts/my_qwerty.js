// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Myanmar3 layout: http://www.myanmarlanguage.org/unicode/myanmar3-keyboard-layout

var MY_QWERTY_LAYOUT = {
  'id': 'my_qwerty',
  'title': '\u1019\u103C\u1014\u103A\u1019\u102C\u1018\u102C\u101E\u102C - QWERTY',
  'mappings': {
    '': {
      '': '၌၁၂၃၄၅၆၇၈၉၀-=' +
          '{{်}}{{်ို}}ေရတယု{{ိ}}{{ော}}ပံ{{ော်}}၎' +
           'ာသဒ္ဂဟဇကလဉး' +
           'ငအစဝဗနမ့၊။'
    },
    'c': { // One key for Kinzi.
      '': '~…©®™’‘–•—×−+' +
          'ၗၙ{{}}ၓဌ{{}}ဦဤ{{}}{{}}{}|' +
          '{{}}ၑဎ{{}}{{}}{{}}{{}}{{}}ၕ:”' +
          '{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}။'
    },
    's,sc': {
      '': '၍!@#$%^&*()_+' +
           '၏{{}}ဲြထျူီဩဖ{{}}ဪ\\' +
           'ါဿဓ်ဃှဈခဠည"' +
           '{{င်္}}{{}}ဆ{{ွ}}ဘဏ{{ံ}},.?'
    },
    'l,cl': {
      '': '`1234567890-=' +
          'qwertyuiop[]\\' +
          'asdfghjkl;\'' +
          'zxcvbnm,./'
    },
    'sl,scl': {
      '': '~!@#$%^&*()_+' +
          'QWERTYUIOP{}|' +
          'ASDFGHJKL:"' +
          'ZXCVBNM<>?'
    }
  },
  'transform' : {
    // NEW 29-Apr-2020
    // Reorder e-vowel after consonant.
    '\u200c([\u1031\u1084])': '\u200c$1',
    '\u200c([\u1031\u1084])\u001d?([\u1000-\u102a\u103f\u104e])': '$2$1',

    // Reorder vowel E after consonant
    '\u200c([\u1031\u1084])\u001d?([\u1000-\u102a\u103f\u104e])': '$2$1',

    // Keep E after medials
    '([\u103c-\u103e]*\u1031)\u001d\u103b': '\u103b$1',
    '([\u103b]*)([\u103d-\u103e]*)\u1031\u001d\u103c': '$1\u103c$2\u1031',
    '([\u103b\u103c]*)([\u103e]*)\u1031\u001d\u103d': '$1\u103d$2\u1031',
    '([\u103b-\u103d]*)\u1031\u001d\u103e': '$1\u103e\u1031',

    // Reorder medials without E vowel
    '([\u103c-\u103e]+)\u001d?\u103b': '\u103b$1',
    '([\u103b]*)([\u103d-\u103e]+)\u001d?\u103c': '$1\u103c$2',
    '([\u103b\u103c]*)([\u103e]+)\u001d?\u103d': '$1\u103d$2',

     // Move E after kinzi in 1 step.
    '(\u200c\u1031)\u001d?([\u1004\u101b\u105a]\u103a\u1039)': '$2\u1031',
     // Move E after kinzi assembled in several steps.
    '([\u1004\u101b\u105a])(\u1031)\u001d\u103a': '$1\u103a$2',
    '([\u1004\u101b\u105a])\u103a(\u1031)\u001d?\u1039': '$1\u103a\u1039$2',
    '([\u1004\u101b\u105a])\u103a\u1039(\u1031)\u001d([\u1000-\u102a\u103f\u104e])':
    '$1\u103a\u1039$3\u1031',

    // Move E after subscripted consonant(s).
    '\u1031\u001d?\u1039([\u1000-\u1019\u101c\u101e\u1020\u1021\u105a\u105d])' :
        '\u1039$1\u1031',

    // Move lower vowels after upper vowels'
    '([\u102f\u1030\u1037]+)([\u102d\u102e\u1032-\u1036\u1071-\u1074\u1085\u109d]+)' :
        '$2$1',

    // Standardize order of these
    '\u103a\u1037': '\u1037\u103a',

    // Move vowel anusvara relative to vowel signs
    '([\u1032\u1036])\u001d?([\u102d-\u1030\1032-\u1036\u1071-\u1074\u1085\u109d]+)':
        '$2$1',

    // Move vowel anusvara relative to medials signs
    '\u1036([\u103b|\u103c\u103d|\u103e])': '$1\u1036',

    // Visible virama before visarga
    '([\u1038\u1087-\u108d\u108f\u109a-\u109c])(\u103a)' : '$2$1',

    // Substitutions of common combinations:
    '\u1005\u103b': '\u1008',
    '\u1025\u102e': '\u1026',
    '\u101e\u103c': '\u1029',
    '\u101e\u103c\u1031\u001d?\u102c\u103a': '\u102a',

  }

};

// Load the layout and inform the keyboard to switch layout if necessary.
google.elements.keyboard.loadme(MY_QWERTY_LAYOUT);
my = MY_QWERTY_LAYOUT;
