import React, { useEffect, useState } from 'react'
import socketio, { Socket } from 'socket.io-client'

interface Answer {
  text: string,
  isCorrect: boolean
}

interface Question {
  prompt: string,
  pointValue: number,
  answers: Answer[]
}

export default function Millionaire() {
  const [connection, setConnection] = useState<typeof Socket>()
  const [question, setQuestion] = useState<Question | null>(null)

  useEffect(
    () => {
      const connection = socketio('/lobby')
      setConnection(connection)

      // initializes question generation
      connection.on('question_generated', (question: Question) => {
        setQuestion(question)
        console.log(question)
      })
    },
    []
  )
  
  // this functionality with later be broken into two parts:
  // "start" button to begin game and "next" button to continue playing,
  // unless I decide to automatically present next question on correct answer after short timer
  const handleGenerateQuestion = () => {
    connection!.emit('generate_question')
  }

  // TODO: helper function to randomize answers that is called on 'get a question'

  return (
    <>
      <div>
        <div>
          <button onClick={() => handleGenerateQuestion()}>Get a question!</button>
        </div>
        <div className="d-flex flew-row justify-content-center pt-4 pb-1">
          {question?.prompt}
        </div>
        <div>
          {question?.answers?.map((answer) => 
            <div key={answer.text}>
              {answer.text}
            </div>
          )}
        </div>
      </div>
    </>
  )
}