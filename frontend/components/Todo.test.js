import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import server from "../../backend/mock-server";
import { resetTodos } from "../../backend/helpers";
import Todo from "./Todo";

describe("Todos Component", () => {
  let user, dishes, groceries, laundry, input;
  afterEach(() => {
    server.resetHandlers();
  });
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  beforeEach(async () => {
    resetTodos();
    render(<Todo />);
    user = userEvent.setup();
    await waitFor(() => {
      dishes = screen.getByText("dishes");
      laundry = screen.getByText("laundry");
      groceries = screen.getByText("groceries");
      input = screen.getAllByPlaceholderText("type todo");
    });
  });

  test("all todos are present", () => {
    expect(laundry).toBeVisible();
    expect(groceries).toBeVisible();
    expect(dishes).toBeVisible();

    // screen.debug()
  });
  test("can do and undo todos", async () => {
    const tasks = ['laundry', 'groceries', 'dishes']
    for(const task of tasks){
      let elem = screen.getByText(task)
      await userEvent.click(elem)
      expect(await screen.findByText(`${task}☑️ `)).toBeVisible()
      userEvent.click(elem)
      expect(await screen.findByText(task)).toBeVisible()
      expect(screen.queryByText(`${task}☑️`)).not.toBeInTheDocument()
    }
  
  });
  
  test("can delete todos", async () => {
   const tasks = ['laundry', 'groceries', 'dishes']
    for(const task of tasks){
     let span = screen.getByText(task)
     await userEvent.click(span.nextSibling)
     await waitFor(()=>{
      expect(span).not.toBeInTheDocument()
     })

    }



  });
  test("can create a new todo, complete it and delete it", async () => {
    let learnJs

    await user.type(input, 'learn Javascript')
    await user.keyboard('[ENTER]')
    await waitFor(()=>{
      learnJs = screen.getByText('learn Javascript')
    })
    await user.click(learnJs)
    await waitFor(()=>{
       expect(screen.queryByText('Learn Javascript')).not.toBeInTheDocument()
       screen.getByText('Learn Javascript')
    })
    await user.click(learnJs.nextSibling)
    await waitFor(() =>{
      expect(learnJs).not.toBeInTheDocument()
    })

  });
});
