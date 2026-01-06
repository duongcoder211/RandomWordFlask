from flask import Flask, render_template, redirect, request
from flask_migrate import Migrate
from .core import setting
from .db import db
from .api.endpoints import main_router
from .models.word import Word
from .utils.stringtrain import string_train

app = Flask(__name__) # => name of this file (app.py) not (main.py or anyname.py)

app.config["SQLALCHEMY_DATABASE_URI"] = setting.SQLALCHEMY_DATABASE_URI
app.secret_key = setting.SECRET_KEY

app.register_blueprint(main_router)

db.init_app(app=app)

migrate = Migrate(app=app, db=db)

# @app.route("/")
# def load_root():
#     return render_template("word.html")

# @app.route("/words/add", methods=["GET", "POST"])
# def add_word():
#     word_info = request.form.to_dict()
#     # word = Word()
#     print(word_info)
#     return "hello"

# @app.route("/words/<int:id>/update")
# def update_word():
#     pass

# @app.route("/words/<int:id>/delete")
# def delete_word():
#     pass

with app.app_context():
    vien = 'Thẩm phán-Judge;Tòa án-Court;Luật sư của tòa án-Court attorney;Tiền boa-Tip;Luật học-jurisprudence;Cải thiện, nâng cao-Improve;Cuộc thi-Competition'
    viru = """
    Cải thiện-Улучшать, улучшить;Cuộc thi-Соревнование; Tuổi thọ-Долголетие; Văn phòng du lịch-Экскурсионное бюро; Văn phòng, công ty-Бюро; Hoá đơn, tài khoản-Счёт; Đếm-Подсчёт; Phụ thuộc vào-Зависеть от 2; Quá trình kiểm tra-Проверка; 
    Trùng nhau-Тождественно равно; Lồng-Клетка; Tấn công- Нападасть, напасть на 4; Ăn thịt, săn mồi-Хищный; Tê giác-Носорог; Trơn tru, trọc, trụi-Гладкий; Xù, bồng, tơi, xốp-Пушистый; 
    Phát triển-Разработать, развивать; Đặt nền móng, đưa ra ý tưởng -Открыть закон;Ba Lan-Польша-Варшама; Đã được giải quyết-Решён (решена,о,ы); Nhãn hiệu, tem thư-Марка (2 морок); 
    Cấu trúc-Структура; Quản lý, điều hành - Управлять 5 НСВ; Tạm thời-Временно; Cần, mục đích để-Предназначать, предназначить; Dài hạn-Дольговременно;Nhanh chóng-Оперативный;
    Đặt, bỏ vào/ Thu xếp, sắp xếp-Помещать, помещить; Hiệu suất-Быстродействие; Tiêu thụ năng lượng-Энергозависимый; Phím-Клавиша; Bàn phím-Клавиатура; Trao đổi-Обмениваться, обменяться 5; 
    Chức năng-Назначение; Biến mất-Исчезать, исчезнуть; Lấy cắp, ăn cắp-Украсть 4; Phát hiện-Обнаружить; Biết rõ-Выяснить; Nhận ra-Оказаться; Nhận ra rằng-Оказалось; 
    Phải, đành phải-Кому (3) приходиться, прийтись; Bất đắc dĩ phải-Пришлось; Cạn lời, hết lời để nói- У 2 нет слов; Cố định, không thay đổi-Постоянный; Bên ngoài-Внешний; Được đề cập đến-Относится к 3;
    Lốp xe, dây tín hiệu-Шина;Nguồn điện-Электропитание; Bên trong-Внутренний; Âm thanh-Акустический; Loa-Колонка;Tiếng gõ-Стук;Chỗ nối, mối nối-Стык;Lưỡi lê-Штык;Có thể, có khả năng-Суметь;
    Làm ồn, gây ồn-Шуметь;Hề, buồn cười-Шут;Tiếng rít-Шипит;Ổ bánh mì-Сайка;Băng đảng, bọn, lũ/ cái chậu-Шайка;No-Сытый;Đã khâu-Шитый;Con cú mèo-Сова;Đường may, khâu-Шов;Hư hỏng-Шалить;
    Phong cách-Стиль; Điềm tĩnh, lặng im-Штиль;Bên trong, bên ngoài cái gì-Внутри, вне 2;Dùng làm gì/ làm việc ở/ dùng để-Служить чем/ где/ для чего;Đeo, mặc vào đâu-Надевать, надеть куда;
    Đồ hoạ-Графический; Biểu tượng-Символьный;Thẻ nhớ-Карта памяти;Đen trắng-Чёрно белый;Có màu-Цветной;Giấy (tính từ)-Бумажный;Khả năng-Способность;Inch-Дюйм;Có khả năng-Способный;
    Nhận ra-Разпознавать, разпознать; Tốt nhất, tối ưu-Оптимальный;Sắc thái-Оттенка;Cho phép-Позволять;Ngoại vi-Периферийный;Khen-Хвалить, похвалить 4 за 4;Mắng-Ругать, отругать 4 за 4;
    Tôn trọng-Уважать 4 за 4; Toà nhà chọc trời-Небоскрёб; Danh tiếng-Репутация; Tiêu-Тратить;Dành-Занимать; Tướng-Генерал; Làm rõ-Уточнять-уточнить; Người làm nội trợ để kiếm tiền-Домрабоница; 
    Người bốc xếp kho-Грузчик; Nữ tính-Феминитив; Thẩm phán-Судья; Tòa án-Суд; Luật sư của tòa án-Адвокат; Công tố viên-Прокурор; Tội lỗi-Виноватый; Đổ lỗi cho-Обвинять 4;
    Chứng ăn cắp vặt-Клептомания; Linh mục-Священник; Tiền boa-Чаевые деньги; Luật học-Юриспруденция; Sợ cái gì-Бояться 2; Rửa tội-Крестить, окрестить ; Cọ, chà/ Bắt chéo-Скрещивать, скрестить;
    Thiết kế-Проэктировать; Hứng thú-Интересоваться 5; Đam mê-Увлекаться 5; Tải gì từ đâu-Скачивать,скачать 4 откуда; Mọi người đều biết, thông tin phổ biến- Ведь/же; Thi đấu với ai- Соревноваться с 5;
    Thanh niên-Парень; Cái gì làm ai hứng thú-Что интересовать кого; Vị trí, chức vụ-Позиция;Thuận lợi-Преимущество, достоинство; Thiếu, khuyết điểm-Недостаток; Sự phụ thuộc-Зависимость; Sự thật, nói dối- Истина, ложь;
    Thật, sai-Истиный, ложный; Giải trí-Развлекать; Sự giải trí-Развлечение; Làm xấu đi, làm tệ đi-Ухудшать, ухудшить; Vi phạm-Нарушать-нарушить; Bản quyền, quyền tác giả-Авторские права;
    Luận án-Тезис; Tranh luận, lập luận-Аргумент; Chạy-Бегать; Chạy (процесс)-Бег; Đuổi theo-Гнать, гонять; Người điều khiển xe ôtô, xe máy-Автогонщик; Có ích, hữu ích-Полезный; Lợi ích-Польза;
    Mang lại lợi ích-Приносить пользу; Kể từ khi-С тех пор; Cho đến giờ-До сих пор; Thích hơn-Предпочитать; Nghi ngờ-Сомневаться в 6; Nấu ăn (процесс)-Кулинария; Học kỳ-Семестр; Kỳ thi-Сессия;
    Chỉ rõ-Указ; Đặt hàng-Приказ; Ló ra, thò ra-Казать; Các vị thánh-Святцы; Người bảo trợ-Покровительница; Buổi lễ (ceremony)-Церемония; Cho ai ăn/ uống gì-Угощать кого 4 чем 5;
    Rượu mật ong-Медовуха; Đề nghị ai cùng làm gì-Предлагать, предложить 3 инф/что; Ghé thăm-Посетить что 4
    """
    # db.drop_all()
    # print('dropped!')
    db.create_all()

    outputvien = string_train(vien, viekey="vie_word", foreignkey="eng_word")
    for vi_en in outputvien:
        db.session.add(Word(**vi_en))

    outputviru = string_train(viru, viekey="vie_word", foreignkey="rus_word")
    for vi_ru in outputviru:
        if Word.query.filter(Word.vie_word == vi_ru["vie_word"]).first() is not None:
            db.session.execute(db.update(Word).where(Word.vie_word == vi_ru["vie_word"]).values(rus_word=vi_ru["rus_word"]))
        else:
            db.session.add(Word(**vi_ru))
    db.session.commit()
