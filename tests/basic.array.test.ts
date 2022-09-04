import { createStore } from "../src";
import { faker } from "@faker-js/faker";

describe("Basic array test", () => {
  const makeElement = () => ({
    id: faker.datatype.string(),
    value: faker.datatype.number(),
  });

  const length = faker.datatype.number({ min: 5, max: 10 });
  const init = Array.from({ length }).map(makeElement);

  const store = createStore({
    initialState: init,
    actions: {
      updateElementValue(state, elementId: string, value: number) {
        const element = state.find((item) => item.id === elementId);
        if (element) {
          element.value = value;
        }
      },
      addElement(state, elementId: string, value: number) {
        state.unshift({
          id: elementId,
          value,
        });
      },
      removeElement(state, elementId: string) {
        return state.filter((item) => item.id !== elementId);
      },
    },
  });

  afterEach(() => {
    store.setState(init);
    store.destroy();
  });

  it("Update state", () => {
    expect(store.getState()).toStrictEqual(init);
    const newElement = makeElement();
    store.actions.addElement(newElement.id, newElement.value);
    expect(store.getState()).not.toStrictEqual(init);
    expect(store.getState()[0]).toStrictEqual(newElement);

    const nextElementValue = faker.datatype.number();
    store.actions.updateElementValue(newElement.id, nextElementValue);
    expect(store.getState()[0]?.value).toStrictEqual(nextElementValue);

    const current = store.getState();
    store.actions.removeElement(newElement.id);
    expect(store.getState()).not.toStrictEqual(current);
    expect(store.getState()).toStrictEqual(init);
  });
});
