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

import json
import logging
import sys

from flask import Flask, render_template, request
from google.cloud import ndb

import burmese_okell_jw_rules
import translit_burmese_rules
import transliterate
import transliterate_burmese_jw

from urllib.parse import unquote

app = Flask(__name__)
ds_client = ndb.Client()


class Visit(ndb.Model):
    """Visit entity registers visitor IP address & timestamp"""
    visitor = ndb.StringProperty()
    timestamp = ndb.DateTimeProperty(auto_now_add=True)


def store_visit(remote_addr, user_agent):
    """create new Visit entity in Datastore"""
    with ds_client.context():
        Visit(visitor='{}: {}'.format(remote_addr, user_agent)).put()


def fetch_visits(limit):
    """get most recent visits"""
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
        'source': '/fonts/Myanmar/Padauk-Regular.ttf',
    },
    {
        'family': 'Padauk-book',
        'longName': 'Padauk-book',
        'source': '/fonts/Myanmar/Padauk-book.ttf',
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
    {
        'family': 'NotoSerifMyanmarMedium',
        'longName': 'Noto Serif Myanmar Medium',
        'source': '/fonts/Myanmar/NotoSerifMyanmar-Medium.ttf',
    },
    {
        'family': 'MmrCensus',
        'longName': 'MMR Census',
        'source': '/fonts/Myanmar/mmrCensus.v5.minbe5.ttf',
    },
    {
        'family': 'MM3',
        'longName': 'MM3',
        'source': '/fonts/Myanmar/mm3-multi-os_16-08-2011.ttf',
    },
    {
        'family': 'ayar',
        'longName': 'Ayar',
        'source': '/fonts/Myanmar/ayar.ttf',
    },
    {
        'family': 'PyidaungsuRegular',
        'longName': 'PyidaungsuRegular',
        'source': '/fonts/Myanmar/Pyidaungsu-2.3_Regular.ttf',
    },
    {
        'family': 'PyidaungsuBold',
        'longName': 'PyidaungsuBold',
        'source': '/fonts/Myanmar/Pyidaungsu-2.3_Bold.ttf',
    },
    {
        'family': 'BeautiUNI-2',
        'longName': 'BeautiUNI-2',
        'source': '/fonts/Myanmar/BeautiUNI-2.ttf',
    },
    {
        'family': 'BeautiUNI-6',
        'longName': 'BeautiUNI-6',
        'source': '/fonts/Myanmar/BeautiUNI-6.ttf',
    },
]

burmese_links = [
    {'linkText': 'Unicode Myanmar',
     'ref': 'http://unicode.org/charts/PDF/U1000.pdf'
     },
    {'linkText': 'Zawgyi Converter',
     'ref': 'https://zawgyi-unicode-test.appspot.com/'
     },
]


class DefaultData():
    def __init__(self):
        self.mm_tools_source = 'https://github.com/googlei18n/myanmar-tools'
        self.detector_demo = 'https://sffc.github.io/myanmar-tools-demos/detector_demo.html'

        myanmar_tools_path = 'https://ajax.googleapis.com/ajax/libs/myanmar-tools/'
        self.detector_version = '1.2.1'
        self.converter_version = '1.2.1'
        # Note that min version seems broken.
        self.detector_url = myanmar_tools_path + self.detector_version + '/zawgyi_detector.min.js'
        self.converter_url = myanmar_tools_path + self.detector_version + '/zawgyi_converter.min.js'

# From sample program. Not used now.
@app.route('/root')
def root():
    """main application (GET) handler"""
    store_visit(request.remote_addr, request.user_agent)
    visits = fetch_visits(10)
    return render_template('index.html', visits=visits)


class TranslitRule(ndb.Model):
    """TranslitRule includes text + description, input and output"""
    rule_text = ndb.StringProperty()
    description = ndb.StringProperty()
    input = ndb.StringProperty()
    output = ndb.StringProperty()
    timestamp = ndb.DateTimeProperty(auto_now_add=True)

# def storeOkell():
#     'test putting data into db'
#     with ds_client.context():
#         TranslitRule(rule_text="TEMPORARY OKELL",  # translit_burmese_rules.TRANSLIT_MY_LATIN,
#                  description='CLDR Burmese to Latin',
#                  input='Mymr', output='Latn').put()
#
# def fetch_rules(limit):
#     'get most recent visits'
#     with ds_client.context():
#         return (v.to_dict() for v in TranslitRule.query().order(
#             -TranslitRule.timestamp).fetch(limit))


LanguageCode = 'my'
Language = 'Burmese'
kb_list = [
    {'shortName': 'my_qwerty',
     'longName': 'Mymanmar QWERTY',
     'instructions': ''
     },
    {'shortName': LanguageCode,
     'longName': Language,
     'instructions': ''
     },
]

translit_rules_list = [
    {'name': 'Okell/JKW',
     'rules': burmese_okell_jw_rules.TRANSLIT_MY_OKELL_JW,
     },
    {'name': 'FONIPA', 'rules': translit_burmese_rules.TRANSLIT_MY_FONIPA,
     },
    {'name': 'Myanmar-Latin', 'rules': translit_burmese_rules.TRANSLIT_MY_LATIN,
     },
    {'name': 'Okell/JKW original', 'rules': translit_burmese_rules.TRANSLIT_MY_OKELL_JW_ORIGINAL,
     },
    {'name': 'Short rule set', 'rules': burmese_okell_jw_rules.SHORT_RULE_SET}
]

# @app.route('/storerules/')
# def storerules():
#     storeOkell()
#     print('Stored rule')
#     return 'Stored'
#
# @app.route('/fetchrules/')
# def fetchrules():
#     fetched = fetch_rules(10)
#     return fetched


# TEMPORARY: Start at Burmese Transliteration
@app.route('/')
@app.route('/translit/', methods=['POST', 'GET'])
def translit():
    """starting on Burmese transliteration"""
    test_data = 'ကြောင်ကြီးတစ်ကောင်'
    test_obj = transliterate_burmese_jw.TestData()
    test_cases = test_obj.test_data
    myanmar_tools_info=DefaultData()

    return render_template(
        'burmese_transliteration.html', language='my',
        kb_list=kb_list,
        test_data=test_data,
        font_list=unicode_font_list,
        links=burmese_links,
        translit_rules_list=translit_rules_list,
        test_cases=test_cases,
        myanmar_tools_info=myanmar_tools_info,
    )


@app.route('/my/dotranslit/', methods=['POST', 'GET'])
def dotranslit():
    rules = in_text = translit_type = None
    if request.method == 'POST':
        dict = request.form.to_dict()
        print('*********** dict POST == %s' % dict.keys())
        try:
            rules = request.form.get('rules')  # Custom rule data.
            in_text = request.form.get('input')
            translit_type = request.form.get('translit_type')
        except:
            print('Error in post = %s' % sys.exc_info()[0])
    else:
        rules = request.args.get('rules')  # Custom rule data.
        translit_type = request.args.get('translit_type')
        in_text = request.args.get('input')

    summary_text = ''
    error = ''
    message = ''
    out_text = "NOT TRANSLITERATED"

    if rules:
        rules_text = unquote(rules)  # It has been escaped.

        translit = transliterate.Transliterate(rules_text, debug=True)
        if not translit:
            summary_text = "Error"
            error = "Error: cannot create transliterator"
            logging.error('****** ERROR in creating transliterator: %s' % rules)
        message = "CUSTOM RULES!"
    else:
        # Switch on type of transliteration
        name = None
        translit = None
        if translit_type:
            # This should be a dictionary index by type.
            for t in translit_rules_list:
                if t['name'] == translit_type:
                    name = t['name']
                    translit = transliterate.Transliterate(
                        t['rules'], debug=False)
        logging.info('Transliterator = %s, %s' % (name, translit))
    if translit:
        summary_text = translit.getPrintSummary()
        out_text = translit.transliterate(in_text)
    result = {
        'outText': out_text,
        'message': message,
        'error': error,
        'summary': summary_text,
    }
    return_string = json.dumps(result)
    return return_string


@app.route('/my/getrules/', methods=['POST', 'GET'])
def getTranslitRules():
    # Returns text of requested rule set.
    translit_type = request.args.get('translit_type')

    rules = None
    if translit_type:
        # This should be a dictionary index by type.
        for t in translit_rules_list:
            if t['name'] == translit_type:
                name = t['name']
                rules = t['rules']

    logging.info('GetRules  = %s, %s' % (translit_type, len(rules)))
    error = ''
    if not rules:
        error = 'Cannot fine rules for %s' % translit_type
    result = {
        'rulesText': rules,
        'error': error,
    }
    return_string = json.dumps(result)
    return return_string

@app.route('/my/allfonts/', methods=['POST', 'GET'])
def AllFontTest():
    utext = request.args.get("utext")
    encodedText = request.args.get("encodedText")
    logging.info('AllFontTest utext =>%s<' % utext)

    return render_template('allFonts.html',
        scriptName=Language,
        fontFamilies=unicode_font_list,
        encodedText=encodedText,
        utext=utext,
        language=Language,
        LanguageTag='my',
    )
