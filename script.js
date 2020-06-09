function $(ID) {
    return document.getElementById(ID);
}

$('StartButton').addEventListener('click', StartQuiz);
$('NextButton').addEventListener('click', () => {
    CurrentQuestionIndex++;
    SetNextQuestion();
});

let ShuffledQuestions, CurrentQuestionIndex, Answered;

function StartQuiz() {
    $('StartButton').classList.add('hide');
    $('QuestionContainer').classList.remove('hide');
    ShuffledQuestions = Questions.sort(() => Math.random() - .5);
    CurrentQuestionIndex = 0;
    SetNextQuestion();
}

function SetNextQuestion() {
    ShowQuestion(ShuffledQuestions[CurrentQuestionIndex]);
}

function ResetState() {
    Answered = false;
    $('NextButton').classList.add('hide');
    $('AnswerButtons').innerHTML = '';
    ClearStatusClass(document.body);
}

function ShowQuestion(Question) {
    ResetState();
    $('Question').innerText = Question.Question;
    Question.Answers.sort(() => Math.random() - .5).forEach(Answer => {
        const Button = document.createElement('button');
        Button.classList.add('button');
        if (Answer.Correct) {
            Button.dataset.Correct = true;
        }
        Button.innerText = Answer.Text;
        Button.addEventListener('click', CheckAnswer);
        $('AnswerButtons').appendChild(Button);
    });
}

function CheckAnswer(Event) {
    const ClickedButton = Event.target;
    if (Answered && ClickedButton.dataset.Correct) {
        CurrentQuestionIndex++;
        return SetNextQuestion();
    } else if (Answered) {
        return;
    }
    Answered = true;
    const Correct = ClickedButton.dataset.Correct ? true : false;
    SetStatusClass(document.body, Correct);
    Array.from($('AnswerButtons').children).forEach((Button) => {
        SetStatusClass(Button, Button.dataset.Correct);
    });
    if (CurrentQuestionIndex < ShuffledQuestions.length) {
        $('NextButton').classList.remove('hide');
    } else {
        $('StartButton').innerText = 'Restart';
        $('StartButton').classList.remove('hide');
    }
}

function ClearStatusClass(Element) {
    Element.classList.remove('correct');
    Element.classList.remove('incorrect');
}

function SetStatusClass(Element, Correct) {
    ClearStatusClass(Element);
    if (Correct) {
        Element.classList.add('correct');
    } else {
        Element.classList.add('incorrect');
    }
}

const Questions = []


for (let i = 2; i <= 8; i++) {
    for (let j = 2; j <= 8; j++) {
        let Question = {
            Question: `${i} * ${j}?`
        }
        Question.Answers = [{
            Text: i * j,
            Correct: true
        }];
        while (Question.Answers.length <= 3) {
            let Text = (Math.floor(Math.random() * 8) + 1) * Math.floor((i + j) / 2);
            if (!Question.Answers.some((Element) => {
                    return Element.Text === Text
                })) {
                Question.Answers.push({
                    Text: Text
                });
            }
        }
        Questions.push(Question);
    }
}
