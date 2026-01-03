from db import db
from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy import Integer, String
import re

class Word(db.Model):
    __tablename__ = 'words'
    
    id: Mapped[Integer] = mapped_column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    rus_word: Mapped[String] = mapped_column(db.String(50), unique=False, nullable=True, default="Enter word mean!")
    eng_word: Mapped[String] = mapped_column(db.String(50), unique=False, nullable=True, default='Enter word mean!')
    vie_word: Mapped[String] = mapped_column(db.String(50), unique=True, nullable=False)

    # def __init__(self, **kwargs):
    #     for key, value in kwargs.items():
    #         setattr(self, key, value)

    @validates("rus_word")
    def validates_rus_word(self, key, rus_word):
        if len(rus_word) == 0 or len(rus_word) > 50:
            raise ValueError("Word length does not greater than 50 letters!")
        if re.fullmatch(r"[а-яА-ЯёЁ ,/()\d]+", rus_word) is None or re.match(r"[\d]", rus_word):
            raise ValueError("Russian word must be a acrilic string start with a letter!")
        return rus_word
    
    @validates("eng_word")
    def validates_eng_word(self, key, eng_word):
        if len(eng_word) == 0 or len(eng_word) > 50:
            raise ValueError("Word length does not greater than 50 letters!")
        if re.fullmatch(r"[\d ]+", eng_word) or re.match(r"\d", eng_word):
            raise ValueError("English word must be a latin string start with a letter!")
        return eng_word
    
    @validates("vie_word")
    def validates_vie_word(self, key, vie_word):
        if len(vie_word) == 0 or len(vie_word) > 50:
            raise ValueError("Word length does not greater than 50 letters!")
        if re.fullmatch(r"[\d ]+", vie_word) or re.match(r"\d", vie_word):
            raise ValueError("Vietnamese word must be a latin string start with a letter!")
        return vie_word
