// types/izipay.d.ts
declare global {
  interface Window {
    Izipay: {
      enums: {
        payActions: {
          PAY: string;
        };
        processType: {
          AUTHORIZATION: string;
        };
        showMethods: {
          ALL: string;
        };
        documentType: {
          DNI: string;
        };
        typeForm: {
          POP_UP: string;
          IFRAME: string;
        };
      };
      new(config: { config: IzipayConfig }): IzipayCheckout;
    };
  }

  interface IzipayConfig {
    transactionId: string;
    action: string;
    merchantCode: string;
    order: {
      orderNumber: string;
      currency: string;
      amount: string;
      processType: string;
      merchantBuyerId: string;
      dateTimeTransaction: number;
      payMethod: string;
    };
    billing: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      document: string;
      documentType: string;
    };
    render: {
      typeForm: string;
      container: string;
      showButtonProcessForm: boolean;
    };
    appearance: {
      logo: string;
    };
  }

  interface IzipayCheckout {
    LoadForm(params: {
      authorization: string;
      keyRSA: string;
      callbackResponse: (response: any) => void;
    }): void;
  }
}

export {};