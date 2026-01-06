from flask import flash, redirect, render_template, request, session, Blueprint, jsonify, url_for
from sqlalchemy import text
from ..models.word import Word
from ..models.wordbackup import WordBackup
from ..db.database import db
from ..utils import string_train
# import json

main_router = Blueprint("app", __name__)

isRus = True

@main_router.route("/")
def load_root():
    words = db.session.execute(db.select(Word).order_by(Word.vie_word_normalized)).scalars().all()
    # words = db.session.execute(db.select(Word).order_by(Word.vie_word)).scalars().all()
    # res = [{"vie_word":  word.vie_word, "rus_word":  word.rus_word, "eng_word" : word.eng_word} for word in words]
    
    if isRus == False:
        vienres = [{"vie_word":  word.vie_word, "eng_word": word.eng_word} for word in words]
        return render_template("randomword.html", words=enumerate(vienres, 0), lang="eng_word")
    
    virures = [{"vie_word":  word.vie_word, "rus_word": word.rus_word} for word in words]
    return render_template("randomword.html", words=enumerate(virures, 0), lang = "rus_word", isRus=isRus)
    
    # return to js
    # return jsonify(
    #     success=True,
    #     message="Data processed successfully",
    #     result=res
    # )
    
    # return render_template("randomword.html", words=enumerate(words, 1))
    # return vienres, 200 # return to html

@main_router.route("/add", methods=["GET", "POST"])
def add_or_update_word():
    if request.method == "POST":
        word_info = request.get_json()
        try:
            if isRus == False:
                outputvien = string_train(word_info, viekey="vie_word", foreignkey="eng_word")
                for vi_en in outputvien:
                    if Word.query.filter(Word.vie_word == vi_en["vie_word"]).first() is not None:
                        # directly to db, not through model validates
                        # db.session.execute(db.update(Word).where(Word.vie_word == vi_en["vie_word"]).values(eng_word=vi_en["eng_word"]))
                        Word.query.filter(Word.vie_word == vi_en["vie_word"]).first().eng_word=vi_en["eng_word"]
                    elif Word.query.filter(Word.eng_word == vi_en["eng_word"]).first() is not None:
                        # db.session.execute(db.update(Word).where(Word.eng_word == vi_en["eng_word"]).values(vie_word=vi_en["vie_word"]))
                        Word.query.filter(Word.eng_word == vi_en["eng_word"]).first().vie_word=vi_en["vie_word"]
                    else:
                        db.session.add(Word(**vi_en))

                    #WordBackup
                    if WordBackup.query.filter(WordBackup.vie_word == vi_en["vie_word"]).first() is not None:
                        WordBackup.query.filter(WordBackup.vie_word == vi_en["vie_word"]).first().eng_word=vi_en["eng_word"]
                    elif WordBackup.query.filter(WordBackup.eng_word == vi_en["eng_word"]).first() is not None:
                        WordBackup.query.filter(WordBackup.eng_word == vi_en["eng_word"]).first().vie_word=vi_en["vie_word"]
                    else:
                        db.session.add(WordBackup(**vi_en))
            else:
                outputviru = string_train(word_info, viekey="vie_word", foreignkey="rus_word")
                for vi_ru in outputviru:
                    if Word.query.filter(Word.vie_word == vi_ru["vie_word"]).first() is not None:
                        Word.query.filter(Word.vie_word == vi_ru["vie_word"]).first().rus_word = vi_ru["rus_word"]
                        # db.session.execute(db.update(Word).where(Word.vie_word == vi_ru["vie_word"]).values(rus_word=vi_ru["rus_word"]))
                    elif Word.query.filter(Word.rus_word == vi_ru["rus_word"]).first() is not None:
                        Word.query.filter(Word.rus_word == vi_ru["rus_word"]).first().vie_word=vi_ru["vie_word"]
                        # db.session.execute(db.update(Word).where(Word.rus_word == vi_ru["rus_word"]).values(vie_word=vi_ru["vie_word"]))
                    else:
                        db.session.add(Word(**vi_ru))

                    #WordBackup
                    if WordBackup.query.filter(WordBackup.vie_word == vi_ru["vie_word"]).first() is not None:
                        WordBackup.query.filter(WordBackup.vie_word == vi_ru["vie_word"]).first().rus_word = vi_ru["rus_word"]
                    elif WordBackup.query.filter(WordBackup.rus_word == vi_ru["rus_word"]).first() is not None:
                        WordBackup.query.filter(WordBackup.rus_word == vi_ru["rus_word"]).first().vie_word=vi_ru["vie_word"]
                    else:
                        db.session.add(WordBackup(**vi_ru))
            db.session.commit()
        except Exception as E:
            print(E)
    return redirect('/')

@main_router.route("/change-language")
def change_language():
    global isRus
    isRus = not isRus
    return redirect("/")

@main_router.route("/update")
def update_word():
    pass

@main_router.route("/delete", methods=["GET", "POST"])
def delete_word():
    if request.method == "POST":
        word_info = request.get_json()
        try:
            if isRus == False:
                outputvien = string_train(word_info, viekey="vie_word", foreignkey="eng_word")
                for vi_en in outputvien:
                    if Word.query.filter(Word.vie_word == vi_en["vie_word"]).first() is not None:
                        db.session.execute(db.delete(Word).where(Word.vie_word == vi_en["vie_word"]))

            outputviru = string_train(word_info, viekey="vie_word", foreignkey="rus_word")
            for vi_ru in outputviru:
                if Word.query.filter(Word.vie_word == vi_ru["vie_word"]).first() is not None:
                    db.session.execute(db.delete(Word).where(Word.vie_word == vi_ru["vie_word"]))
            
            db.session.commit()
        except Exception as E:
            print(E)
    return redirect('/')

@main_router.app_errorhandler(404)
def app_handler_404(error):
    return render_template('error_404.html'),404

@main_router.app_errorhandler(500)
def app_handler_500(error):
    return render_template('wrong.html'),500