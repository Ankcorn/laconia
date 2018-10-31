const handler = require("../src/calculate-total-order").handler;

describe("calculate-total-order", () => {
  let tracker, totalOrderStorage, orderRepository, restaurantId;

  beforeEach(() => {
    tracker = { tick: jest.fn() };
    totalOrderStorage = { putJson: jest.fn() };
    orderRepository = {
      findByRestaurantId: jest
        .fn()
        .mockReturnValue([{ total: 5 }, { total: 10 }])
    };
    restaurantId = 5;
  });

  it("calls orderRepository to find orders", async () => {
    await handler.emit(
      "item",
      { tracker, totalOrderStorage, orderRepository },
      restaurantId
    );

    expect(orderRepository.findByRestaurantId).toBeCalledWith(restaurantId);
  });

  it("calculates total order for every restaurant id", async () => {
    await handler.emit(
      "item",
      { tracker, totalOrderStorage, orderRepository },
      restaurantId
    );
    await Promise.resolve();

    expect(tracker.tick).toBeCalledWith({ restaurantId, total: 15 });
  });

  it("calculates total order for every restaurant id", async () => {
    await handler.emit(
      "item",
      { tracker, totalOrderStorage, orderRepository },
      restaurantId
    );
    await Promise.resolve();

    expect(totalOrderStorage.putJson).toBeCalledWith({
      restaurantId,
      total: 15
    });
  });
});
