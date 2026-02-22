def get_answer(question: str):
    question = question.lower()

    if "principal" in question:
        return "The principal of SREC is Dr. XYZ."

    if "course" in question:
        return "SREC offers CSE, IT, ECE, EEE, MECH."

    if "location" in question:
        return "SREC is located in Coimbatore."

    return "I am SREC assistant. Please ask about college."
