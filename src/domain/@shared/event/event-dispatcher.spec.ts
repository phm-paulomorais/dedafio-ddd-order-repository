import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLogWhenAddressIsChangedHandler from "../../customer/event/handler/envia-consolelog-when-address-is-changed.handler";
import EnviaConsoleLog1WhenCustomerIsCreatedHandler from "../../customer/event/handler/envia-consolelog1-when-customer-is-created.handler";
import EnviaConsoleLog2WhenCustomerIsCreatedHandler from "../../customer/event/handler/envia-consolelog2-when-customer-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify Customer event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventConsoleLog1Handler = new EnviaConsoleLog1WhenCustomerIsCreatedHandler();
    const eventConsoleLog2Handler = new EnviaConsoleLog2WhenCustomerIsCreatedHandler();

    const spyEventConsoleLog1Handler = jest.spyOn(eventConsoleLog1Handler, "handle");
    const spyEventConsoleLog2Handler = jest.spyOn(eventConsoleLog2Handler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", eventConsoleLog2Handler);

    expect( 
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventConsoleLog1Handler);

    expect( 
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventConsoleLog2Handler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Wesley Willians"
    });

    // Quando o notify for executado o EnviaConsoleLog1WhenCustomerIsCreatedHandler.handle() 
    // e EnviaConsoleLog2WhenCustomerIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventConsoleLog1Handler).toHaveBeenCalled();
    expect(spyEventConsoleLog2Handler).toHaveBeenCalled();

    const eventAddressChangedHandler = new EnviaConsoleLogWhenAddressIsChangedHandler();
    
    const spyEventAddressChangedHandler = jest.spyOn(eventAddressChangedHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventAddressChangedHandler);

    expect( 
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventAddressChangedHandler);

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: 1,
      name: "Wesley Willians",
      endereco: "Rua Florianópolis, 200 - Centro - 88040-100"
    });

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventAddressChangedHandler).toHaveBeenCalled();
  });

});
