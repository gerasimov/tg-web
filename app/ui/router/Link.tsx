import { T, Component, Ref, Destroyable } from 'app/core/dom'

interface LinkProps {
  children: any;
  to: string;
}

@Destroyable
@Component
class Link {
  @Ref aRef: any;

  init() {
    this.aRef.current.addEventListener('click', this.handleClick);
  };
  
  handleClick = (e: any) => {
    e.preventDefault();
    const { target } = e;
    history.pushState({}, '', this.props.to);
  };
  
  destroy = () => {
    console.log(this.aRef);
    this.aRef.current.removeEventListener('click', this.handleClick);
  }
  

  render = ({ children, to }: LinkProps) => (
    <a ref={this.aRef} href={to}>
      {children}
    </a>
  );
}

export default Link;
