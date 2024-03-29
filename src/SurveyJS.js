import 'survey-core/modern.min.css';
import { Survey, Model } from 'survey-react-ui';
import { StylesManager } from 'survey-core';
import $ from 'jquery';
import * as surveyJSON from './resources/survey.json';
import {wait} from "@testing-library/user-event/dist/utils";
import { useNavigate } from "react-router-dom";
import * as css from "./CSS/SurveyJS.css";

import {v4 as uuid} from "uuid";

StylesManager.applyTheme("modern");

function SurveyJS(props) {
  let navigate = useNavigate();
  /*TIMEOUT/////////////////////////////////////////////////////////////////////
  const timeout=1000*60*10; //10 minuti
  let inactivityTimeout = false
  resetTimeout()
  function onUserInactivity() {
    stopTimeout()
    if (props.logged)
      props.doLogout();
    navigate("/")
  }
  function resetTimeout() {
    console.log("reset")
    clearTimeout(inactivityTimeout)
    inactivityTimeout = setTimeout(onUserInactivity, timeout)
  }
  function stopTimeout(){
    clearTimeout(inactivityTimeout)
    document.onmousemove=null;
  }
  document.onmousemove = resetTimeout;
  ////////////////////////////////////////////////////////////////////////////////*/

  //RESPONSE//////////////////////////////////////////////////////////////////////////////////////////
  function sendDataToServer(sur) {
    let data = sur.data
    data.resultID= uuid()
    data.timestamp= new Date().getTime()
    data.multisensor = localStorage.getItem("multi")
    if (props.logged===""||props.logged===null) {
      data.user = generateAnonId()
      props.setAnon(data.user)
      props.setAnswers(data)
      //deactivate timeout
      //stopTimeout()
      navigate("/furtherQuestions")
    }
    else {
      data.user = props.logged
      props.setAnswers(data)
      props.setAnswers(data)
      //deactivate timeout
      //stopTimeout()
      navigate("/thanks")
    }
  }
  //LAYOUT E LINGUA////////////////////////////////////////////////////////////////////////////////////
  let survey = new Model(surveyJSON);
  if(props.ita)
    survey.locale='it'
  //ANIMAZIONI//////////////////////////////////////////////////////////////////////////////////////////
  let doAnimantion = true;
  survey.onCurrentPageChanging.add(function (sender, options) {
    if (!doAnimantion) return;
    options.allowChanging = false;
    setTimeout(function () {
      doAnimantion = false;
      sender.currentPage = options.newCurrentPage;
      doAnimantion = true;
    }, 500);
    $(document.getElementById("survey")).slideUp();
  });
  survey.onCurrentPageChanged.add(function (/*sender*/) {
    $(document.getElementById("survey")).hide().slideDown();
  });
  survey.onCompleting.add(function (sender, options) {
    if (!doAnimantion) return;
    options.allowComplete = false;
    setTimeout(function () {
      doAnimantion = false;
      sender.doComplete();
      doAnimantion = true;
    }, 500);
    $(document.getElementById("survey")).slideUp()
    wait(1000)
    $(document.getElementById("survey")).slideDown()
  });
//CSS/////////////////////////////////////////////////////////////////////////////////
  survey.onUpdateQuestionCssClasses.add((sur, options) => {
    let classes = options.cssClasses
    if(options.question.name==="Q4"||options.question.name==="Q3") {
      classes.title += " thermal noBorder"
      classes.titleOnAnswer = "";
    }
    else if(options.question.name==="Q5"||options.question.name==="Q6") {
      classes.title += " acoustic noBorder"
      classes.titleOnAnswer = "";
    }
    else if(options.question.name==="Q7"||options.question.name==="Q8"||options.question.name==="Q9") {
      classes.title += " visual noBorder"
      classes.titleOnAnswer = "";
    }
    else if(options.question.name==="Q10"||options.question.name==="Q11") {
      classes.title += " air noBorder"
      classes.titleOnAnswer = "";
    }
  })
  /////////////////////////////////////////////////////////////////////////////////
  function routeHome(){
    //stopTimeout()
    navigate("/")
  }
  return(
  <div className="container">
    <p style={{ "position": "fixed", "top": 25, "right": 25, "text-decoration": "underline", "font-size":"130%"}} onClick={routeHome} >Home</p>
    <div className='row h-100 align-items-center'>
      <div className='col-12'>
        <Survey id = 'surveyjs' css={css} model = {survey} onComplete={sendDataToServer} /></div>
    </div>
    <p id="prometeoSmallLogo" style={{marginTop:"-70px"}}>PROMET&O</p>
  </div>);

}

function generateAnonId()
{
  return "anon"+Math.floor(10000000 + Math.random() * 90000000).toString()
}

export default SurveyJS;