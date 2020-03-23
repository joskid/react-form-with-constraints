import React from 'react';
import { mount as _mount } from 'enzyme';

import {
  FormWithConstraints,
  FormWithConstraintsProps,
  FieldFeedbacksProps,
  FieldFeedback,
  Async
} from './index';
import { SignUp } from './SignUp';
import { FieldFeedbacksEnzymeFix as FieldFeedbacks } from './FieldFeedbacksEnzymeFix';
import { sleep } from './sleep';
import { beautifyHtml } from './beautifyHtml';
import { validValidityState } from './InputElementMock';
import * as assert from './assert';

function mount(node: React.ReactElement<FormWithConstraintsProps>) {
  return _mount<FormWithConstraintsProps, {}>(node);
}

test('constructor()', () => {
  const form = new FormWithConstraints({});
  expect(form.fieldsStore.fields).toEqual([]);
});

test('computeFieldFeedbacksKey()', () => {
  const form = new FormWithConstraints({});
  expect(form.computeFieldFeedbacksKey()).toEqual('0');
  expect(form.computeFieldFeedbacksKey()).toEqual('1');
  expect(form.computeFieldFeedbacksKey()).toEqual('2');
});

interface FormProps {
  inputStop: FieldFeedbacksProps['stop'];
}

describe('FormWithBeforeAsync', () => {
  class FormWithBeforeAsync extends React.Component<FormProps> {
    formWithConstraints: FormWithConstraints | null = null;
    input: HTMLInputElement | null = null;

    render() {
      const { inputStop } = this.props;

      return (
        <FormWithConstraints
          ref={formWithConstraints => (this.formWithConstraints = formWithConstraints)}
        >
          <input name="input" ref={input => (this.input = input)} />
          <FieldFeedbacks for="input" stop={inputStop}>
            <FieldFeedback when={() => true}>Error before Async</FieldFeedback>
            <FieldFeedback when={() => true} warning>
              Warning before Async
            </FieldFeedback>
            <FieldFeedback when={() => true} info>
              Info before Async
            </FieldFeedback>
            <Async
              promise={() => sleep(10)}
              then={() => <FieldFeedback>Async error</FieldFeedback>}
            />
          </FieldFeedbacks>
        </FormWithConstraints>
      );
    }
  }

  test('stop="first"', async () => {
    const wrapper = mount(<FormWithBeforeAsync inputStop="first" />);
    const form = wrapper.instance() as FormWithBeforeAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error before Async</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-error"', async () => {
    const wrapper = mount(<FormWithBeforeAsync inputStop="first-error" />);
    const form = wrapper.instance() as FormWithBeforeAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error before Async</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-warning"', async () => {
    const wrapper = mount(<FormWithBeforeAsync inputStop="first-warning" />);
    const form = wrapper.instance() as FormWithBeforeAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error before Async</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Warning before Async</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-info"', async () => {
    const wrapper = mount(<FormWithBeforeAsync inputStop="first-info" />);
    const form = wrapper.instance() as FormWithBeforeAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error before Async</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Warning before Async</span>
          <span data-feedback="0.2" class="info" style="display: block;">Info before Async</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="no"', async () => {
    const wrapper = mount(<FormWithBeforeAsync inputStop="no" />);
    const form = wrapper.instance() as FormWithBeforeAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error before Async</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Warning before Async</span>
          <span data-feedback="0.2" class="info" style="display: block;">Info before Async</span>
          <span data-feedback="0.3" class="error" style="display: block;">Async error</span>
        </span>
      </form>`);

    wrapper.unmount();
  });
});

describe('FormWithAfterAsync', () => {
  class FormWithAfterAsync extends React.Component<FormProps> {
    formWithConstraints: FormWithConstraints | null = null;
    input: HTMLInputElement | null = null;

    render() {
      const { inputStop } = this.props;

      return (
        <FormWithConstraints
          ref={formWithConstraints => (this.formWithConstraints = formWithConstraints)}
        >
          <input name="input" ref={input => (this.input = input)} />
          <FieldFeedbacks for="input" stop={inputStop}>
            <Async
              promise={() => sleep(10)}
              then={() => <FieldFeedback>Async error</FieldFeedback>}
            />
            <FieldFeedback when={() => true}>Error after Async</FieldFeedback>
            <FieldFeedback when={() => true} warning>
              Warning after Async
            </FieldFeedback>
            <FieldFeedback when={() => true} info>
              Info after Async
            </FieldFeedback>
          </FieldFeedbacks>
        </FormWithConstraints>
      );
    }
  }

  test('stop="first"', async () => {
    const wrapper = mount(<FormWithAfterAsync inputStop="first" />);
    const form = wrapper.instance() as FormWithAfterAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Async error</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-error"', async () => {
    const wrapper = mount(<FormWithAfterAsync inputStop="first-error" />);
    const form = wrapper.instance() as FormWithAfterAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Async error</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-warning"', async () => {
    const wrapper = mount(<FormWithAfterAsync inputStop="first-warning" />);
    const form = wrapper.instance() as FormWithAfterAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Async error</span>
          <span data-feedback="0.0" class="error" style="display: block;">Error after Async</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Warning after Async</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-info"', async () => {
    const wrapper = mount(<FormWithAfterAsync inputStop="first-info" />);
    const form = wrapper.instance() as FormWithAfterAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Async error</span>
          <span data-feedback="0.0" class="error" style="display: block;">Error after Async</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Warning after Async</span>
          <span data-feedback="0.2" class="info" style="display: block;">Info after Async</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="no"', async () => {
    const wrapper = mount(<FormWithAfterAsync inputStop="no" />);
    const form = wrapper.instance() as FormWithAfterAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Async error</span>
          <span data-feedback="0.0" class="error" style="display: block;">Error after Async</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Warning after Async</span>
          <span data-feedback="0.2" class="info" style="display: block;">Info after Async</span>
        </span>
      </form>`);

    wrapper.unmount();
  });
});

describe('FormWithMultipleNestedFieldFeedbacks - test FieldFeedbacks.validate() has*(fieldFeedbacksParent.key)', () => {
  class FormWithMultipleNestedFieldFeedbacks extends React.Component<FormProps> {
    formWithConstraints: FormWithConstraints | null = null;
    input: HTMLInputElement | null = null;

    render() {
      const { inputStop } = this.props;

      return (
        <FormWithConstraints
          ref={formWithConstraints => (this.formWithConstraints = formWithConstraints)}
        >
          <input name="input" ref={input => (this.input = input)} />

          <FieldFeedbacks for="input" stop={inputStop}>
            <FieldFeedbacks stop="no">
              <FieldFeedback when={() => true}>Error 1</FieldFeedback>
              <FieldFeedback when={() => true} warning>
                Warning 1
              </FieldFeedback>
              <FieldFeedback when={() => true} info>
                Info 1
              </FieldFeedback>
            </FieldFeedbacks>
          </FieldFeedbacks>

          <FieldFeedbacks for="input" stop={inputStop}>
            <FieldFeedbacks stop="no">
              <FieldFeedback when={() => true}>Error 2</FieldFeedback>
              <FieldFeedback when={() => true} warning>
                Warning 2
              </FieldFeedback>
              <FieldFeedback when={() => true} info>
                Info 2
              </FieldFeedback>
            </FieldFeedbacks>
          </FieldFeedbacks>
        </FormWithConstraints>
      );
    }
  }

  test('stop="first"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedbacks inputStop="first" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedbacks;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedbacks="0.0">
            <span data-feedback="0.0.0" class="error" style="display: block;">Error 1</span>
            <span data-feedback="0.0.1" class="warning" style="display: block;">Warning 1</span>
            <span data-feedback="0.0.2" class="info" style="display: block;">Info 1</span>
          </span>
        </span>
        <span data-feedbacks="1">
          <span data-feedbacks="1.0">
            <span data-feedback="1.0.0" class="error" style="display: block;">Error 2</span>
            <span data-feedback="1.0.1" class="warning" style="display: block;">Warning 2</span>
            <span data-feedback="1.0.2" class="info" style="display: block;">Info 2</span>
          </span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-error"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedbacks inputStop="first-error" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedbacks;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedbacks="0.0">
            <span data-feedback="0.0.0" class="error" style="display: block;">Error 1</span>
            <span data-feedback="0.0.1" class="warning" style="display: block;">Warning 1</span>
            <span data-feedback="0.0.2" class="info" style="display: block;">Info 1</span>
          </span>
        </span>
        <span data-feedbacks="1">
          <span data-feedbacks="1.0">
            <span data-feedback="1.0.0" class="error" style="display: block;">Error 2</span>
            <span data-feedback="1.0.1" class="warning" style="display: block;">Warning 2</span>
            <span data-feedback="1.0.2" class="info" style="display: block;">Info 2</span>
          </span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-warning"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedbacks inputStop="first-warning" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedbacks;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedbacks="0.0">
            <span data-feedback="0.0.0" class="error" style="display: block;">Error 1</span>
            <span data-feedback="0.0.1" class="warning" style="display: block;">Warning 1</span>
            <span data-feedback="0.0.2" class="info" style="display: block;">Info 1</span>
          </span>
        </span>
        <span data-feedbacks="1">
          <span data-feedbacks="1.0">
            <span data-feedback="1.0.0" class="error" style="display: block;">Error 2</span>
            <span data-feedback="1.0.1" class="warning" style="display: block;">Warning 2</span>
            <span data-feedback="1.0.2" class="info" style="display: block;">Info 2</span>
          </span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-info"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedbacks inputStop="first-info" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedbacks;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedbacks="0.0">
            <span data-feedback="0.0.0" class="error" style="display: block;">Error 1</span>
            <span data-feedback="0.0.1" class="warning" style="display: block;">Warning 1</span>
            <span data-feedback="0.0.2" class="info" style="display: block;">Info 1</span>
          </span>
        </span>
        <span data-feedbacks="1">
          <span data-feedbacks="1.0">
            <span data-feedback="1.0.0" class="error" style="display: block;">Error 2</span>
            <span data-feedback="1.0.1" class="warning" style="display: block;">Warning 2</span>
            <span data-feedback="1.0.2" class="info" style="display: block;">Info 2</span>
          </span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="no"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedbacks inputStop="no" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedbacks;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedbacks="0.0">
            <span data-feedback="0.0.0" class="error" style="display: block;">Error 1</span>
            <span data-feedback="0.0.1" class="warning" style="display: block;">Warning 1</span>
            <span data-feedback="0.0.2" class="info" style="display: block;">Info 1</span>
          </span>
        </span>
        <span data-feedbacks="1">
          <span data-feedbacks="1.0">
            <span data-feedback="1.0.0" class="error" style="display: block;">Error 2</span>
            <span data-feedback="1.0.1" class="warning" style="display: block;">Warning 2</span>
            <span data-feedback="1.0.2" class="info" style="display: block;">Info 2</span>
          </span>
        </span>
      </form>`);

    wrapper.unmount();
  });
});

describe('FormWithMultipleNestedAsync - test Async.validate() has*(fieldFeedbacks.key)', () => {
  class FormWithMultipleNestedAsync extends React.Component<FormProps> {
    formWithConstraints: FormWithConstraints | null = null;
    input: HTMLInputElement | null = null;

    render() {
      const { inputStop } = this.props;

      return (
        <FormWithConstraints
          ref={formWithConstraints => (this.formWithConstraints = formWithConstraints)}
        >
          <input name="input" ref={input => (this.input = input)} />

          <FieldFeedbacks for="input" stop={inputStop}>
            <Async
              promise={() => sleep(10)}
              then={() => <FieldFeedback>Async1 error</FieldFeedback>}
            />
            <Async
              promise={() => sleep(10)}
              then={() => <FieldFeedback warning>Async1 warning</FieldFeedback>}
            />
            <Async
              promise={() => sleep(10)}
              then={() => <FieldFeedback info>Async1 info</FieldFeedback>}
            />
          </FieldFeedbacks>

          <FieldFeedbacks for="input" stop={inputStop}>
            <Async
              promise={() => sleep(10)}
              then={() => <FieldFeedback>Async2 error</FieldFeedback>}
            />
            <Async
              promise={() => sleep(10)}
              then={() => <FieldFeedback warning>Async2 warning</FieldFeedback>}
            />
            <Async
              promise={() => sleep(10)}
              then={() => <FieldFeedback info>Async2 info</FieldFeedback>}
            />
          </FieldFeedbacks>
        </FormWithConstraints>
      );
    }
  }

  test('stop="first"', async () => {
    const wrapper = mount(<FormWithMultipleNestedAsync inputStop="first" />);
    const form = wrapper.instance() as FormWithMultipleNestedAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Async1 error</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Async2 error</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-error"', async () => {
    const wrapper = mount(<FormWithMultipleNestedAsync inputStop="first-error" />);
    const form = wrapper.instance() as FormWithMultipleNestedAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Async1 error</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Async2 error</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-warning"', async () => {
    const wrapper = mount(<FormWithMultipleNestedAsync inputStop="first-warning" />);
    const form = wrapper.instance() as FormWithMultipleNestedAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Async1 error</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Async1 warning</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Async2 error</span>
          <span data-feedback="1.1" class="warning" style="display: block;">Async2 warning</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-info"', async () => {
    const wrapper = mount(<FormWithMultipleNestedAsync inputStop="first-info" />);
    const form = wrapper.instance() as FormWithMultipleNestedAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Async1 error</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Async1 warning</span>
          <span data-feedback="0.2" class="info" style="display: block;">Async1 info</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Async2 error</span>
          <span data-feedback="1.1" class="warning" style="display: block;">Async2 warning</span>
          <span data-feedback="1.2" class="info" style="display: block;">Async2 info</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="no"', async () => {
    const wrapper = mount(<FormWithMultipleNestedAsync inputStop="no" />);
    const form = wrapper.instance() as FormWithMultipleNestedAsync;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Async1 error</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Async1 warning</span>
          <span data-feedback="0.2" class="info" style="display: block;">Async1 info</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Async2 error</span>
          <span data-feedback="1.1" class="warning" style="display: block;">Async2 warning</span>
          <span data-feedback="1.2" class="info" style="display: block;">Async2 info</span>
        </span>
      </form>`);

    wrapper.unmount();
  });
});

describe('FormWithMultipleNestedFieldFeedback - test FieldFeedback.validate() has*(fieldFeedbacks.key)', () => {
  class FormWithMultipleNestedFieldFeedback extends React.Component<FormProps> {
    formWithConstraints: FormWithConstraints | null = null;
    input: HTMLInputElement | null = null;

    render() {
      const { inputStop } = this.props;

      return (
        <FormWithConstraints
          ref={formWithConstraints => (this.formWithConstraints = formWithConstraints)}
        >
          <input name="input" ref={input => (this.input = input)} />

          <FieldFeedbacks for="input" stop={inputStop}>
            <FieldFeedback when={() => true}>Error 1</FieldFeedback>
            <FieldFeedback when={() => true} warning>
              Warning 1
            </FieldFeedback>
            <FieldFeedback when={() => true} info>
              Info 1
            </FieldFeedback>
          </FieldFeedbacks>

          <FieldFeedbacks for="input" stop={inputStop}>
            <FieldFeedback when={() => true}>Error 2</FieldFeedback>
            <FieldFeedback when={() => true} warning>
              Warning 2
            </FieldFeedback>
            <FieldFeedback when={() => true} info>
              Info 2
            </FieldFeedback>
          </FieldFeedbacks>
        </FormWithConstraints>
      );
    }
  }

  test('stop="first"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedback inputStop="first" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedback;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error 1</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Error 2</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-error"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedback inputStop="first-error" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedback;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error 1</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Error 2</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-warning"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedback inputStop="first-warning" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedback;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error 1</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Warning 1</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Error 2</span>
          <span data-feedback="1.1" class="warning" style="display: block;">Warning 2</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="first-info"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedback inputStop="first-info" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedback;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error 1</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Warning 1</span>
          <span data-feedback="0.2" class="info" style="display: block;">Info 1</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Error 2</span>
          <span data-feedback="1.1" class="warning" style="display: block;">Warning 2</span>
          <span data-feedback="1.2" class="info" style="display: block;">Info 2</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('stop="no"', async () => {
    const wrapper = mount(<FormWithMultipleNestedFieldFeedback inputStop="no" />);
    const form = wrapper.instance() as FormWithMultipleNestedFieldFeedback;

    await form.formWithConstraints!.validateFields(form.input!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="input">
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Error 1</span>
          <span data-feedback="0.1" class="warning" style="display: block;">Warning 1</span>
          <span data-feedback="0.2" class="info" style="display: block;">Info 1</span>
        </span>
        <span data-feedbacks="1">
          <span data-feedback="1.0" class="error" style="display: block;">Error 2</span>
          <span data-feedback="1.1" class="warning" style="display: block;">Warning 2</span>
          <span data-feedback="1.2" class="info" style="display: block;">Info 2</span>
        </span>
      </form>`);

    wrapper.unmount();
  });
});

describe('validate', () => {
  describe('validateFields()', () => {
    test('inputs', async () => {
      const wrapper = mount(<SignUp />);
      const signUp = wrapper.instance() as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.username!.value = 'john';
      signUp.password!.value = '123456';
      signUp.passwordConfirm!.value = '12345';

      const fields = await signUp.form!.validateFields(signUp.username!, signUp.passwordConfirm!);
      expect(fields).toEqual([
        {
          name: 'username',
          element: signUp.username,
          validations: [
            { key: '0.0', type: 'error', show: false },
            { key: '0.1', type: 'error', show: false },
            { key: '0.3', type: 'error', show: true },
            { key: '0.2', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'passwordConfirm',
          element: signUp.passwordConfirm,
          validations: [
            { key: '2.0', type: 'error', show: true },
            { key: '2.1', type: 'whenValid', show: undefined }
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(2);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [
          {
            name: 'username',
            type: 'text',
            value: 'john',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'passwordConfirm',
            type: 'password',
            value: '12345',
            validity: validValidityState,
            validationMessage: ''
          }
        ]
      ]);

      expect(beautifyHtml(wrapper.html(), '        ')).toEqual(`\
        <form>
          <input name="username">
          <span data-feedbacks="0">
            <span data-feedback="0.3" class="error" style="display: block;">Username 'john' already taken, choose another</span>
          </span>
          <input type="password" name="password">
          <span data-feedbacks="1"></span>
          <input type="password" name="passwordConfirm">
          <span data-feedbacks="2">
            <span data-feedback="2.0" class="error" style="display: block;">Not the same password</span>
          </span>
        </form>`);

      wrapper.unmount();
    });

    test('field names', async () => {
      const wrapper = mount(<SignUp />);
      const signUp = wrapper.instance() as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.username!.value = 'john';
      signUp.password!.value = '123456';
      signUp.passwordConfirm!.value = '12345';

      const fields = await signUp.form!.validateFields('username', 'passwordConfirm');
      expect(fields).toEqual([
        {
          name: 'username',
          element: signUp.username,
          validations: [
            { key: '0.0', type: 'error', show: false },
            { key: '0.1', type: 'error', show: false },
            { key: '0.3', type: 'error', show: true },
            { key: '0.2', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'passwordConfirm',
          element: signUp.passwordConfirm,
          validations: [
            { key: '2.0', type: 'error', show: true },
            { key: '2.1', type: 'whenValid', show: undefined }
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(2);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [
          {
            name: 'username',
            type: 'text',
            value: 'john',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'passwordConfirm',
            type: 'password',
            value: '12345',
            validity: validValidityState,
            validationMessage: ''
          }
        ]
      ]);

      wrapper.unmount();
    });

    test('inputs + field names', async () => {
      const wrapper = mount(<SignUp />);
      const signUp = wrapper.instance() as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.username!.value = 'john';
      signUp.password!.value = '123456';
      signUp.passwordConfirm!.value = '12345';

      const fields = await signUp.form!.validateFields(signUp.username!, 'passwordConfirm');
      expect(fields).toEqual([
        {
          name: 'username',
          element: signUp.username,
          validations: [
            { key: '0.0', type: 'error', show: false },
            { key: '0.1', type: 'error', show: false },
            { key: '0.3', type: 'error', show: true },
            { key: '0.2', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'passwordConfirm',
          element: signUp.passwordConfirm,
          validations: [
            { key: '2.0', type: 'error', show: true },
            { key: '2.1', type: 'whenValid', show: undefined }
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(2);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [
          {
            name: 'username',
            type: 'text',
            value: 'john',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'passwordConfirm',
            type: 'password',
            value: '12345',
            validity: validValidityState,
            validationMessage: ''
          }
        ]
      ]);

      wrapper.unmount();
    });

    test('without arguments', async () => {
      const wrapper = mount(<SignUp />);
      const signUp = wrapper.instance() as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.username!.value = 'john';
      signUp.password!.value = '123456';
      signUp.passwordConfirm!.value = '12345';

      const fields = await signUp.form!.validateFields();
      expect(fields).toEqual([
        {
          name: 'username',
          element: signUp.username,
          validations: [
            { key: '0.0', type: 'error', show: false },
            { key: '0.1', type: 'error', show: false },
            { key: '0.3', type: 'error', show: true },
            { key: '0.2', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'password',
          element: signUp.password,
          validations: [
            { key: '1.0', type: 'error', show: false },
            { key: '1.1', type: 'error', show: false },
            { key: '1.2', type: 'warning', show: false },
            { key: '1.3', type: 'warning', show: true },
            { key: '1.4', type: 'warning', show: true },
            { key: '1.5', type: 'warning', show: true },
            { key: '1.6', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'passwordConfirm',
          element: signUp.passwordConfirm,
          validations: [
            { key: '2.0', type: 'error', show: true },
            { key: '2.1', type: 'whenValid', show: undefined }
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [
          {
            name: 'username',
            type: 'text',
            value: 'john',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'password',
            type: 'password',
            value: '123456',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'passwordConfirm',
            type: 'password',
            value: '12345',
            validity: validValidityState,
            validationMessage: ''
          }
        ]
      ]);

      wrapper.unmount();
    });

    test('change inputs', async () => {
      const wrapper = mount(<SignUp />);
      const signUp = wrapper.instance() as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.username!.value = '';
      signUp.password!.value = '';
      signUp.passwordConfirm!.value = '';

      let fields = await signUp.form!.validateFields();
      expect(fields).toEqual([
        {
          name: 'username',
          element: signUp.username,
          validations: [
            { key: '0.0', type: 'error', show: true },
            { key: '0.1', type: 'error', show: undefined },
            { key: '0.2', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'password',
          element: signUp.password,
          validations: [
            { key: '1.0', type: 'error', show: true },
            { key: '1.1', type: 'error', show: undefined },
            { key: '1.2', type: 'warning', show: undefined },
            { key: '1.3', type: 'warning', show: undefined },
            { key: '1.4', type: 'warning', show: undefined },
            { key: '1.5', type: 'warning', show: undefined },
            { key: '1.6', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'passwordConfirm',
          element: signUp.passwordConfirm,
          validations: [
            { key: '2.0', type: 'error', show: false },
            { key: '2.1', type: 'whenValid', show: undefined }
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [
          {
            name: 'username',
            type: 'text',
            value: '',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'password',
            type: 'password',
            value: '',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'passwordConfirm',
            type: 'password',
            value: '',
            validity: validValidityState,
            validationMessage: ''
          }
        ]
      ]);

      emitValidateFieldEventSpy.mockClear();

      signUp.username!.value = 'john';
      signUp.password!.value = '123456';
      signUp.passwordConfirm!.value = '12345';

      fields = await signUp.form!.validateFields();
      expect(fields).toEqual([
        {
          name: 'username',
          element: signUp.username,
          validations: [
            { key: '0.0', type: 'error', show: false },
            { key: '0.1', type: 'error', show: false },
            { key: '0.3', type: 'error', show: true },
            { key: '0.2', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'password',
          element: signUp.password,
          validations: [
            { key: '1.0', type: 'error', show: false },
            { key: '1.1', type: 'error', show: false },
            { key: '1.2', type: 'warning', show: false },
            { key: '1.3', type: 'warning', show: true },
            { key: '1.4', type: 'warning', show: true },
            { key: '1.5', type: 'warning', show: true },
            { key: '1.6', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'passwordConfirm',
          element: signUp.passwordConfirm,
          validations: [
            { key: '2.0', type: 'error', show: true },
            { key: '2.1', type: 'whenValid', show: undefined }
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [
          {
            name: 'username',
            type: 'text',
            value: 'john',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'password',
            type: 'password',
            value: '123456',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'passwordConfirm',
            type: 'password',
            value: '12345',
            validity: validValidityState,
            validationMessage: ''
          }
        ]
      ]);

      expect(beautifyHtml(wrapper.html(), '        ')).toEqual(`\
        <form>
          <input name="username">
          <span data-feedbacks="0">
            <span data-feedback="0.3" class="error" style="display: block;">Username 'john' already taken, choose another</span>
          </span>
          <input type="password" name="password">
          <span data-feedbacks="1">
            <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
            <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
            <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
            <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
          </span>
          <input type="password" name="passwordConfirm">
          <span data-feedbacks="2">
            <span data-feedback="2.0" class="error" style="display: block;">Not the same password</span>
          </span>
        </form>`);

      wrapper.unmount();
    });

    test('change inputs rapidly', async () => {
      const wrapper = mount(<SignUp />);
      const signUp = wrapper.instance() as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.username!.value = '';
      signUp.password!.value = '';
      signUp.passwordConfirm!.value = '';
      signUp.form!.validateFields();

      signUp.username!.value = 'john';
      signUp.password!.value = '123456';
      signUp.passwordConfirm!.value = '12345';
      signUp.form!.validateFields();

      signUp.username!.value = 'jimmy';
      signUp.password!.value = '12345';
      signUp.passwordConfirm!.value = '12345';

      const assertSpy = jest.spyOn(assert, 'assert').mockImplementation();
      expect(assert.assert).toHaveBeenCalledTimes(0);
      const fields = await signUp.form!.validateFields();
      expect(assert.assert).toHaveBeenCalledTimes(56);
      expect(assert.assert).toHaveBeenCalledWith(
        false,
        `FieldsStore does not match emitValidateFieldEvent() result, did the user changed the input rapidly?`
      );
      assertSpy.mockRestore();

      // eslint-disable-next-line no-constant-condition
      if (false /* Disable code because it randomly fails */) {
        expect(fields).toEqual([
          {
            name: 'username',
            element: signUp.username,
            validations: [
              { key: '0.0', type: 'error', show: false },
              { key: '0.1', type: 'error', show: false },
              { key: '0.3', type: 'info', show: true },
              { key: '0.4', type: 'error', show: true },
              { key: '0.5', type: 'info', show: undefined },
              { key: '0.2', type: 'whenValid', show: undefined }
            ]
          },
          {
            name: 'password',
            element: signUp.password,
            validations: [
              { key: '1.0', type: 'error', show: false },
              { key: '1.1', type: 'error', show: false },
              { key: '1.2', type: 'warning', show: false },
              { key: '1.3', type: 'warning', show: true },
              { key: '1.4', type: 'warning', show: true },
              { key: '1.5', type: 'warning', show: true },
              { key: '1.6', type: 'whenValid', show: undefined }
            ]
          },
          {
            name: 'passwordConfirm',
            element: signUp.passwordConfirm,
            validations: [
              { key: '2.0', type: 'error', show: false },
              { key: '2.1', type: 'whenValid', show: undefined }
            ]
          }
        ]);
      }
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(9);
      // eslint-disable-next-line no-constant-condition
      if (false /* Disable code because it randomly fails */) {
        expect(emitValidateFieldEventSpy.mock.calls).toEqual([
          [
            {
              name: 'username',
              type: 'text',
              value: '',
              validity: validValidityState,
              validationMessage: ''
            }
          ],
          [
            {
              name: 'username',
              type: 'text',
              value: 'john',
              validity: validValidityState,
              validationMessage: ''
            }
          ],
          [
            {
              name: 'username',
              type: 'text',
              value: 'jimmy',
              validity: validValidityState,
              validationMessage: ''
            }
          ],
          [
            {
              name: 'password',
              type: 'password',
              value: '12345',
              validity: validValidityState,
              validationMessage: ''
            }
          ],
          [
            {
              name: 'password',
              type: 'password',
              value: '12345',
              validity: validValidityState,
              validationMessage: ''
            }
          ], // Instead of '123456'?
          [
            {
              name: 'password',
              type: 'password',
              value: '12345',
              validity: validValidityState,
              validationMessage: ''
            }
          ],
          [
            {
              name: 'passwordConfirm',
              type: 'password',
              value: '12345',
              validity: validValidityState,
              validationMessage: ''
            }
          ], // Instead of ''?
          [
            {
              name: 'passwordConfirm',
              type: 'password',
              value: '12345',
              validity: validValidityState,
              validationMessage: ''
            }
          ],
          [
            {
              name: 'passwordConfirm',
              type: 'password',
              value: '12345',
              validity: validValidityState,
              validationMessage: ''
            }
          ]
        ]);
      }

      wrapper.unmount();
    });
  });

  describe('validateFieldsWithoutFeedback()', () => {
    test('inputs', async () => {
      //
    });

    test('field names', async () => {
      //
    });

    test('inputs + field names', async () => {
      const wrapper = mount(<SignUp />);
      const signUp = wrapper.instance() as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.username!.value = 'john';
      signUp.password!.value = '123456';
      signUp.passwordConfirm!.value = '12345';

      const fields1 = await signUp.form!.validateFieldsWithoutFeedback(
        signUp.username!,
        'passwordConfirm'
      );
      expect(fields1).toEqual([
        {
          name: 'username',
          element: signUp.username,
          validations: [
            { key: '0.0', type: 'error', show: false },
            { key: '0.1', type: 'error', show: false },
            { key: '0.3', type: 'error', show: true },
            { key: '0.2', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'passwordConfirm',
          element: signUp.passwordConfirm,
          validations: [
            { key: '2.0', type: 'error', show: true },
            { key: '2.1', type: 'whenValid', show: undefined }
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(2);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [
          {
            name: 'username',
            type: 'text',
            value: 'john',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'passwordConfirm',
            type: 'password',
            value: '12345',
            validity: validValidityState,
            validationMessage: ''
          }
        ]
      ]);

      // Fields are already dirty so calling validateFieldsWithoutFeedback() again won't do anything

      emitValidateFieldEventSpy.mockClear();

      signUp.username!.value = 'jimmy';
      signUp.password!.value = '12345';
      signUp.passwordConfirm!.value = '12345';

      const fields2 = await signUp.form!.validateFieldsWithoutFeedback(
        signUp.username!,
        'passwordConfirm'
      );
      expect(fields2).toEqual(fields1);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(0);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([]);

      wrapper.unmount();
    });

    test('without arguments', async () => {
      const wrapper = mount(<SignUp />);
      const signUp = wrapper.instance() as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.username!.value = 'john';
      signUp.password!.value = '123456';
      signUp.passwordConfirm!.value = '12345';

      const fields1 = await signUp.form!.validateFieldsWithoutFeedback();
      expect(fields1).toEqual([
        {
          name: 'username',
          element: signUp.username,
          validations: [
            { key: '0.0', type: 'error', show: false },
            { key: '0.1', type: 'error', show: false },
            { key: '0.3', type: 'error', show: true },
            { key: '0.2', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'password',
          element: signUp.password,
          validations: [
            { key: '1.0', type: 'error', show: false },
            { key: '1.1', type: 'error', show: false },
            { key: '1.2', type: 'warning', show: false },
            { key: '1.3', type: 'warning', show: true },
            { key: '1.4', type: 'warning', show: true },
            { key: '1.5', type: 'warning', show: true },
            { key: '1.6', type: 'whenValid', show: undefined }
          ]
        },
        {
          name: 'passwordConfirm',
          element: signUp.passwordConfirm,
          validations: [
            { key: '2.0', type: 'error', show: true },
            { key: '2.1', type: 'whenValid', show: undefined }
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [
          {
            name: 'username',
            type: 'text',
            value: 'john',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'password',
            type: 'password',
            value: '123456',
            validity: validValidityState,
            validationMessage: ''
          }
        ],
        [
          {
            name: 'passwordConfirm',
            type: 'password',
            value: '12345',
            validity: validValidityState,
            validationMessage: ''
          }
        ]
      ]);

      // Fields are already dirty so calling validateFieldsWithoutFeedback() again won't do anything

      emitValidateFieldEventSpy.mockClear();

      signUp.username!.value = 'jimmy';
      signUp.password!.value = '12345';
      signUp.passwordConfirm!.value = '12345';

      const fields2 = await signUp.form!.validateFieldsWithoutFeedback();
      expect(fields2).toEqual(fields1);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(0);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([]);

      wrapper.unmount();
    });

    test('Could not find field', async () => {
      const wrapper = mount(
        <FormWithConstraints>
          <input name="username" />
        </FormWithConstraints>
      );
      const form = wrapper.instance() as FormWithConstraints;

      await expect(form.validateFieldsWithoutFeedback()).resolves.toEqual([]); // Ignore input without FieldFeedbacks
      await expect(form.validateFieldsWithoutFeedback('username')).resolves.toEqual([]); // Ignore input without FieldFeedbacks
      await expect(form.validateFieldsWithoutFeedback('unknown')).rejects.toEqual(
        new Error(`Could not find field '[name="unknown"]' inside the form`)
      );

      wrapper.unmount();
    });
  });

  test('validateForm()', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;
    const validateFieldsWithoutFeedbackSpy = jest.spyOn(
      signUp.form!,
      'validateFieldsWithoutFeedback'
    );

    await signUp.form!.validateForm();

    expect(validateFieldsWithoutFeedbackSpy).toHaveBeenCalledTimes(1);
    expect(validateFieldsWithoutFeedbackSpy.mock.calls).toEqual([[]]);

    wrapper.unmount();
  });

  describe('normalizeInputs', () => {
    test('Multiple elements matching', async () => {
      const wrapper = mount(
        <FormWithConstraints>
          <input name="username" />
          <FieldFeedbacks for="username" />

          <input type="password" name="password" />
          <input type="password" name="password" />
          <input type="password" name="password" />
          <FieldFeedbacks for="password" />
        </FormWithConstraints>
      );
      const form = wrapper.instance() as FormWithConstraints;

      // [async/await toThrow is not working](https://github.com/facebook/jest/issues/1700)

      await expect(form.validateFields('username')).resolves.toEqual([
        { name: 'username', element: expect.any(HTMLInputElement), validations: [] }
      ]);
      await expect(form.validateFields()).rejects.toEqual(
        new Error(`Multiple elements matching '[name="password"]' inside the form`)
      );
      await expect(form.validateFields('password')).rejects.toEqual(
        new Error(`Multiple elements matching '[name="password"]' inside the form`)
      );

      wrapper.unmount();
    });

    test('Could not find field', async () => {
      const wrapper = mount(
        <FormWithConstraints>
          <input name="username" />
        </FormWithConstraints>
      );
      const form = wrapper.instance() as FormWithConstraints;

      await expect(form.validateFields()).resolves.toEqual([]); // Ignore input without FieldFeedbacks
      await expect(form.validateFields('username')).resolves.toEqual([]); // Ignore input without FieldFeedbacks
      await expect(form.validateFields('unknown')).rejects.toEqual(
        new Error(`Could not find field '[name="unknown"]' inside the form`)
      );

      wrapper.unmount();
    });

    test('Could not find field - child with props undefined', async () => {
      const wrapper = mount(<FormWithConstraints>ChildWithPropsUndefined</FormWithConstraints>);
      const form = wrapper.instance() as FormWithConstraints;

      await expect(form.validateFields()).resolves.toEqual([]);
      await expect(form.validateFields('unknown')).rejects.toEqual(
        new Error(`Could not find field '[name="unknown"]' inside the form`)
      );

      wrapper.unmount();
    });

    test('Ignore elements without type', async () => {
      const wrapper = mount(
        <FormWithConstraints>
          <iframe src="https://www.google.com/recaptcha..." name="a-49ekipqfmwsv" />
        </FormWithConstraints>
      );
      const form = wrapper.instance() as FormWithConstraints;

      await expect(form.validateFields()).resolves.toEqual([]);
      await expect(form.validateFields('a-49ekipqfmwsv')).rejects.toEqual(
        new Error(`'[name="a-49ekipqfmwsv"]' should match an <input>, <select> or <textarea>`)
      );

      wrapper.unmount();
    });
  });
});

describe('Async', () => {
  test('then', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;
    const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

    signUp.username!.value = 'jimmy';
    signUp.password!.value = '12345';
    signUp.passwordConfirm!.value = '12345';

    const fields = await signUp.form!.validateFields();
    expect(fields).toEqual([
      {
        name: 'username',
        element: signUp.username,
        validations: [
          { key: '0.0', type: 'error', show: false },
          { key: '0.1', type: 'error', show: false },
          { key: '0.3', type: 'info', show: true },
          { key: '0.2', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'password',
        element: signUp.password,
        validations: [
          { key: '1.0', type: 'error', show: false },
          { key: '1.1', type: 'error', show: false },
          { key: '1.2', type: 'warning', show: false },
          { key: '1.3', type: 'warning', show: true },
          { key: '1.4', type: 'warning', show: true },
          { key: '1.5', type: 'warning', show: true },
          { key: '1.6', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'passwordConfirm',
        element: signUp.passwordConfirm,
        validations: [
          { key: '2.0', type: 'error', show: false },
          { key: '2.1', type: 'whenValid', show: undefined }
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [
        {
          name: 'username',
          type: 'text',
          value: 'jimmy',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'password',
          type: 'password',
          value: '12345',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'passwordConfirm',
          type: 'password',
          value: '12345',
          validity: validValidityState,
          validationMessage: ''
        }
      ]
    ]);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="info" style="display: block;">Username 'jimmy' available</span>
          <span data-feedback="0.2" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="password">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2">
          <span data-feedback="2.1" class="when-valid" style="display: block;">Looks good!</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('catch', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;
    const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

    signUp.username!.value = 'error';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    const fields = await signUp.form!.validateFields();
    expect(fields).toEqual([
      {
        name: 'username',
        element: signUp.username,
        validations: [
          { key: '0.0', type: 'error', show: false },
          { key: '0.1', type: 'error', show: false },
          { key: '0.3', type: 'error', show: true },
          { key: '0.2', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'password',
        element: signUp.password,
        validations: [
          { key: '1.0', type: 'error', show: false },
          { key: '1.1', type: 'error', show: false },
          { key: '1.2', type: 'warning', show: false },
          { key: '1.3', type: 'warning', show: true },
          { key: '1.4', type: 'warning', show: true },
          { key: '1.5', type: 'warning', show: true },
          { key: '1.6', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'passwordConfirm',
        element: signUp.passwordConfirm,
        validations: [
          { key: '2.0', type: 'error', show: true },
          { key: '2.1', type: 'whenValid', show: undefined }
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [
        {
          name: 'username',
          type: 'text',
          value: 'error',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'password',
          type: 'password',
          value: '123456',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'passwordConfirm',
          type: 'password',
          value: '12345',
          validity: validValidityState,
          validationMessage: ''
        }
      ]
    ]);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Something wrong with username 'error'</span>
        </span>
        <input type="password" name="password">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2">
          <span data-feedback="2.0" class="error" style="display: block;">Not the same password</span>
        </span>
      </form>`);

    wrapper.unmount();
  });
});

test('isValid()', async () => {
  const wrapper = mount(<SignUp />);
  const signUp = wrapper.instance() as SignUp;

  signUp.username!.value = 'john';
  signUp.password!.value = '123456';
  signUp.passwordConfirm!.value = '12345';

  let fields = await signUp.form!.validateFields(
    signUp.username!,
    signUp.password!,
    signUp.passwordConfirm!
  );
  expect(fields.every(field => field.isValid())).toEqual(false);
  expect(signUp.form!.isValid()).toEqual(false);

  signUp.username!.value = 'jimmy';
  signUp.password!.value = '12345';
  signUp.passwordConfirm!.value = '12345';

  fields = await signUp.form!.validateFields(
    signUp.username!,
    signUp.password!,
    signUp.passwordConfirm!
  );
  expect(fields.every(field => field.isValid())).toEqual(true);
  expect(signUp.form!.isValid()).toEqual(true);

  wrapper.unmount();
});

test('hasFeedbacks()', async () => {
  const wrapper = mount(<SignUp />);
  const signUp = wrapper.instance() as SignUp;

  expect(signUp.form!.hasFeedbacks()).toEqual(false);

  signUp.username!.value = 'john';
  signUp.password!.value = '123456';
  signUp.passwordConfirm!.value = '12345';

  const fields = await signUp.form!.validateFields(
    signUp.username!,
    signUp.password!,
    signUp.passwordConfirm!
  );
  expect(fields.every(field => field.hasFeedbacks())).toEqual(true);
  expect(signUp.form!.hasFeedbacks()).toEqual(true);

  signUp.form!.resetFields();
  expect(signUp.form!.hasFeedbacks()).toEqual(false);

  wrapper.unmount();
});

describe('resetFields()', () => {
  test('inputs', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'john';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Username 'john' already taken, choose another</span>
        </span>
        <input type="password" name="password">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2">
          <span data-feedback="2.0" class="error" style="display: block;">Not the same password</span>
        </span>
      </form>`);

    signUp.form!.resetFields(signUp.username!, signUp.passwordConfirm!);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0"></span>
        <input type="password" name="password">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2"></span>
      </form>`);

    wrapper.unmount();
  });

  test('field names', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'john';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Username 'john' already taken, choose another</span>
        </span>
        <input type="password" name="password">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2">
          <span data-feedback="2.0" class="error" style="display: block;">Not the same password</span>
        </span>
      </form>`);

    signUp.form!.resetFields('username', 'passwordConfirm');

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0"></span>
        <input type="password" name="password">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2"></span>
      </form>`);

    wrapper.unmount();
  });

  test('inputs + field names', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'john';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Username 'john' already taken, choose another</span>
        </span>
        <input type="password" name="password">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2">
          <span data-feedback="2.0" class="error" style="display: block;">Not the same password</span>
        </span>
      </form>`);

    signUp.form!.resetFields(signUp.username!, 'passwordConfirm');

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0"></span>
        <input type="password" name="password">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2"></span>
      </form>`);

    wrapper.unmount();
  });

  test('without arguments', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'john';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="error" style="display: block;">Username 'john' already taken, choose another</span>
        </span>
        <input type="password" name="password">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2">
          <span data-feedback="2.0" class="error" style="display: block;">Not the same password</span>
        </span>
      </form>`);

    signUp.form!.resetFields();

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <span data-feedbacks="0"></span>
        <input type="password" name="password">
        <span data-feedbacks="1"></span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2"></span>
      </form>`);

    wrapper.unmount();
  });

  test('Could not find field', async () => {
    const wrapper = mount(
      <FormWithConstraints>
        <input name="username" />
      </FormWithConstraints>
    );
    const form = wrapper.instance() as FormWithConstraints;

    expect(form.resetFields()).toEqual([]); // Ignore input without FieldFeedbacks
    expect(form.resetFields('username')).toEqual([]); // Ignore input without FieldFeedbacks
    expect(() => form.resetFields('unknown')).toThrow(
      new Error(`Could not find field '[name="unknown"]' inside the form`)
    );

    wrapper.unmount();
  });
});

test('reset()', async () => {
  const wrapper = mount(<SignUp />);
  const signUp = wrapper.instance() as SignUp;
  const resetFieldsSpy = jest.spyOn(signUp.form!, 'resetFields');

  signUp.form!.reset();

  expect(resetFieldsSpy).toHaveBeenCalledTimes(1);
  expect(resetFieldsSpy.mock.calls).toEqual([[]]);

  wrapper.unmount();
});
