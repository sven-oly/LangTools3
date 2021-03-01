# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from flask import Flask, render_template, request
from google.cloud import ndb

import json
import logging

import transliterate
import translit_burmese_rules
import transliterate_burmese_jw

app = Flask(__name__)
ds_client = ndb.Client()

class Visit(ndb.Model):
    'Visit entity registers visitor IP address & timestamp'
    visitor   = ndb.StringProperty()
    timestamp = ndb.DateTimeProperty(auto_now_add=True)

def store_visit(remote_addr, user_agent):
    'create new Visit entity in Datastore'
    with ds_client.context():
        Visit(visitor='{}: {}'.format(remote_addr, user_agent)).put()

def fetch_visits(limit):
    'get most recent visits'
    with ds_client.context():
        return (v.to_dict() for v in Visit.query().order(
                -Visit.timestamp).fetch(limit))

unicode_font_list = [
    {
        'family': 'NotoSansMyanmar',
        'longName': 'Noto Sans Myanmar',
        'source': '/fonts/Myanmar/NotoSansMyanmar-Regular.ttf',
    },
    {
        'family': 'Padauk',
        'longName': 'Padauk',
        'source': '/    fonts/Myanmar/Padauk-Regular.ttf',
    },
    {
        'family': 'NotoSerifMyanmar',
        'longName': 'Noto Serif Myanmar',
        'source': '/fonts/Myanmar/NotoSerifMyanmar-Regular.ttf',
    },
    {
        'family': 'NotoSansMyanmarLight',
        'longName': 'Noto Sans Myanmar Light',
        'source': '/fonts/Myanmar/NotoSansMyanmar-Light.ttf',
    },
    {
        'family': 'NotoSerifMyanmarLight',
        'longName': 'Noto Serif Myanmar Light',
        'source': '/fonts/Myanmar/NotoSerifMyanmar-Light.ttf',
    },
    {
        'family': 'NotoSansMyanmarThin',
        'longName': 'Noto Sans Myanmar Thin',
        'source': '/fonts/Myanmar/NotoSansMyanmar-Thin.ttf',
    },
    {
        'family': 'NotoSerifMyanmarThin',
        'longName': 'Noto Serif Myanmar Thin',
        'source': '/fonts/Myanmar/NotoSerifMyanmar-Thin.ttf',
    },
    {
        'family': 'NotoSansMyanmarMedium',
        'longName': 'Noto Sans Myanmar Medium',
        'source': '/fonts/Myanmar/NotoSansMyanmar-Medium.ttf',
    },
    {
        'family': 'NotoSerifMyanmarMedium',
        'longName': 'Noto Serif Myanmar Medium',
        'source': '/fonts/Myanmar/NotoSerifMyanmar-Medium.ttf',
    },
]

def root():
    'main application (GET) handler'
    store_visit(request.remote_addr, request.user_agent)
    visits = fetch_visits(10)
    return render_template('index.html', visits=visits)

@app.route('/t2/')
def t2():
    'test 2nd option'
    return render_template('ind2.html')

LanguageCode = 'my'
Language = 'Burmese'
kb_list = [
    {'shortName': LanguageCode,
     'longName': Language,
     'instructions': ''
     }
]

translit_rules_list = [
    {'name': 'Okell/JKW',
     'rules': translit_burmese_rules.TRANSLIT_MY_OKELL_JW,
     },
    {'name': 'FONIPA', 'rules': translit_burmese_rules.TRANSLIT_MY_FONIPA,
     },
    {'name': 'Myanmar-Latin', 'rules': translit_burmese_rules.TRANSLIT_MY_LATIN,
     },
]
# TEMPORARY: Start at Burmese Transliteration
@app.route('/')
@app.route('/translit/')
def translit():
    'starting on Burmese transliteration'
    test_data = 'ကြောင်ကြီးတစ်ကောင်'
    return render_template('burmese_transliteration.html', language='my',
                           kb_list=kb_list,
                           test_data=test_data,
                           font_list=unicode_font_list,
                           translit_rules_list=translit_rules_list,
                           test_cases=transliterate_burmese_jw.TestData(None)
    )

@app.route('/my/dotranslit/')
def dotranslit():
    input = request.args.get('input')
    translit_type = request.args.get('translit_type')

    # Switch on type of transliteration
    name = None
    translit = None
    if translit_type:
        for t in translit_rules_list:
            if t['name'] == translit_type:
                name = t['name']
                translit = transliterate.Transliterate(
                    t['rules'], debug=True)
    logging.info('Transliterator = %s, %s' % (name, translit))
    out_text = translit.transliterate(input)
    message = ''
    error = ''
    summary_text = ''
    result = {
        'outText': out_text,
        #'outText' : outText,
        'message' : message,
        'error': error,
        'summary' : summary_text,
    }
    return_string = json.dumps(result)
    return return_string
