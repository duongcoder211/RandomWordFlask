from ..db import db
from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy import Integer, String
import re
import unicodedata

def vie_word_normalized_func(string):
    if not string:
        return ""
    # Chuyển về chữ thường
    text = string.lower()
    # Thay thế 'đ' -> 'dz'
    text = string.replace('đ', 'dz')
    # Bỏ dấu
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    return text


class WordBackup(db.Model):
    __tablename__ = 'wordbackup'
    
    id: Mapped[Integer] = mapped_column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    rus_word: Mapped[String] = mapped_column(db.String(50), unique=False, nullable=True, default="Введите семантику слова!")
    eng_word: Mapped[String] = mapped_column(db.String(50), unique=False, nullable=True, default='Enter word mean!')
    vie_word: Mapped[String] = mapped_column(db.String(50), unique=True, nullable=False)
    vie_word_normalized: Mapped[String] = mapped_column(db.String(50), unique=False, nullable=False, default='')

    # def __init__(self, **kwargs):
    #     for key, value in kwargs.items():
    #         setattr(self, key, value)

    @validates("rus_word")
    def validates_rus_word(self, key, rus_word):
        if len(rus_word) == 0 or len(rus_word) > 50:
            raise ValueError("Word length does not greater than 50 letters!")
        if re.fullmatch(r"^(?!.*-)[\u0400-\u04FF\d\s\W_]+$", rus_word) is None:
            raise ValueError(f"Russian word '{rus_word}' must be a acrilic string!")
        return rus_word
    
    @validates("eng_word")
    def validates_eng_word(self, key, eng_word):
        if len(eng_word) == 0 or len(eng_word) > 50:
            raise ValueError("Word length does not greater than 50 letters!")
        if re.fullmatch(r"^(?!.*-)[a-zA-Z\d\s\W_]+$", eng_word) is None:
            raise ValueError(f"English word '{eng_word}' must be a latin string!")
        return eng_word
    
    @validates("vie_word")
    def validates_vie_word(self, key, vie_word):
        if len(vie_word) == 0 or len(vie_word) > 50:
            raise ValueError("Word length does not greater than 50 letters!")
        # if re.fullmatch(r"^(?!.*-)[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\d\W_]+$", vie_word) is None:
        if re.fullmatch(r"^[^\-\;]+$", vie_word) is None:
            raise ValueError(f"Vietnamese word '{vie_word}' must be a latin string!")
        return vie_word
    