import { Component, Ref, T } from 'app/core/dom'

@Component
export class Stepper {
  @Ref contRef: any;

  constructor(props) {
    this.step = props.initialStep || 0;
  }
  
  init = () => {
    this.renderStep();
  };

  renderStep = () => {
    const { current: cont } = this.contRef;
    
    const StepComponent = this.props.steps[this.step];
    
    if (!StepComponent) {
      return this.props.onEnd();
    }

    const el = <StepComponent {...this.props.innerProps} next={this.nextStep} prev={this.prevStep} />;

    if (cont.firstChild) {
      cont.firstChild.replaceWith(el);
    } else {
      cont.appendChild(el);
    }
  };

  nextStep = () => {
    this.step++;
    this.renderStep();
  };

  prevStep = () => {
    this.step--;
    this.renderStep();
  };

  render = () => {
    const { className } = this.props;  
  
    return <div ref={this.contRef} class={className} />
  }
}

