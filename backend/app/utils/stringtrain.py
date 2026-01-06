
def string_train(str: str = None, *, viekey: str = "vie_word", foreignkey: str = "rus_word") -> list[dict[str, str]]:
    """
        String processing form `foreign-vie; foreign-vie; foreign-vie`
    """
    output = []

    preoutput = str.split(";")
    for part in preoutput:
        if "-" in part:
            words = part.split("-")
            vie = words[0].lower().strip()
            foreign = words[1].lower().strip()
            output.append({viekey: vie, foreignkey: foreign})
        else:
            pass
    return output

