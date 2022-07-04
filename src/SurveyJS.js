import 'survey-core/modern.min.css';
import { Survey, Model } from 'survey-react-ui';
import { StylesManager } from 'survey-core';
//import "./CSS/Hello.css";
import $ from 'jquery';
import * as surveyJSON from './resources/survey.json';
import {wait} from "@testing-library/user-event/dist/utils";
import { useNavigate } from "react-router-dom";
import * as css from "./CSS/SurveyJS.css";

StylesManager.applyTheme("modern");

function SurveyJS(props) {

  let navigate = useNavigate();
  const timeout=1000*60*5; //5 minuti
  let inactivityTimeout = false
  resetTimeout()
  function onUserInactivity() {
      clearTimeout(inactivityTimeout)
      if(props.logged)
        props.doLogout();
      navigate("/")
  }
  function resetTimeout() {
    console.log("timer reset")
    clearTimeout(inactivityTimeout)
    inactivityTimeout = setTimeout(onUserInactivity, timeout)
  }
  document.onmousemove = resetTimeout;

  //RESPONSE//////////////////////////////////////////////////////////////////////////////////////////
  //function sendDataToServer(sur) {
  function sendDataToServer() {
    //alert("The results are: " + JSON.stringify(sur.data));
    if (props.logged==="")
      navigate("/furtherQuestions")
    else
      navigate("/thanks")
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
    console.log(JSON.stringify(classes));
    if(options.question.name==="Q4"||options.question.name==="Q3")
      classes.title += " thermal noBorder"
    else if(options.question.name==="Q5"||options.question.name==="Q6")
      classes.title += " acoustic noBorder"
    else if(options.question.name==="Q7"||options.question.name==="Q8"||options.question.name==="Q9")
      classes.title += " visual noBorder"
    else if(options.question.name==="Q10"||options.question.name==="Q11")
      classes.title += " air noBorder"
  })
  /////////////////////////////////////////////////////////////////////////////////
  return(
  <div className="container">
    <div className='row h-100 align-items-center'>
      <div className='col-12'>
        <Survey id = 'surveyjs' css={css} model = {survey} onComplete={sendDataToServer} /></div>
    </div>
  </div>);

}
export default SurveyJS;