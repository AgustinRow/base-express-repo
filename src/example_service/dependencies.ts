import { ContainerModule, decorate, injectable } from 'inversify';
import ExampleControllers from './example/controllers/example.js';

decorate(injectable(), ExampleControllers);

const dependencyContainer = new ContainerModule(bind => {
  bind<ExampleControllers>('ExampleControllers').to(ExampleControllers);
});

export default dependencyContainer;
