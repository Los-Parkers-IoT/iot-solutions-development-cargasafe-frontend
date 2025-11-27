import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentTokenResponse {
  token: string;
  transactionId: string;
  orderNumber: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  orderNumber?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly BACKEND_URL = environment.baseUrl;
  private readonly MERCHANT_CODE = "4004345";
  
  constructor(private http: HttpClient) {}

  getPaymentToken(amount: number, tenantId: string): Observable<PaymentTokenResponse> {
    return this.http.post<PaymentTokenResponse>(`${this.BACKEND_URL}/payments/izipay/token`, {
      tenantId: tenantId,
      amount: amount
    });
  }

  async processPayment(amount: number, tenantId: string): Promise<PaymentResult> {
    try {
      // Obtener token del backend
      const tokenData = await this.getPaymentToken(amount, tenantId).toPromise();
      
      if (!tokenData?.token) {
        throw new Error('Token inválido del backend');
      }

      // Configurar Izipay
      const unixNow = Math.floor(Date.now() / 1000);
      
      const iziConfig = {
        config: {
          transactionId: tokenData.transactionId,
          action: window.Izipay.enums.payActions.PAY,
          merchantCode: this.MERCHANT_CODE,
          order: {
            orderNumber: tokenData.orderNumber,
            currency: "PEN",
            amount: amount.toFixed(2),
            processType: window.Izipay.enums.processType.AUTHORIZATION,
            merchantBuyerId: `user_${tenantId}`,
            dateTimeTransaction: unixNow,
            payMethod: window.Izipay.enums.showMethods.ALL
          },
          billing: {
            firstName: "Cliente",
            lastName: "CargaSafe",
            email: "cliente@cargasafe.com",
            phoneNumber: "989897960",
            street: "Av. Principal 123",
            city: "Lima",
            state: "Lima",
            country: "PE",
            postalCode: "15000",
            document: "12345678",
            documentType: window.Izipay.enums.documentType.DNI
          },
          render: {
            typeForm: window.Izipay.enums.typeForm.POP_UP,
            container: "body",
            showButtonProcessForm: false
          },
          appearance: {
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs3Kh2obxkoHRH__0Aj6Lke6gRIXA---fICg&s"
          }
        }
      };

      return new Promise((resolve) => {
        const callbackResponsePayment = (response: any) => {
          console.log('Payment response:', response);
          
          if (response && response.code === "00") {
            resolve({
              success: true,
              transactionId: tokenData.transactionId,
              orderNumber: tokenData.orderNumber
            });
          } else {
            resolve({
              success: false,
              error: response?.message || 'Error en el pago'
            });
          }
        };

        try {
          const checkout = new window.Izipay({ config: iziConfig.config });
          checkout.LoadForm({
            authorization: tokenData.token,
            keyRSA: "RSA",
            callbackResponse: callbackResponsePayment
          });
        } catch (err) {
          console.error("Error al cargar Izipay:", err);
          resolve({
            success: false,
            error: 'Error al cargar el formulario de pago'
          });
        }
      });

    } catch (error) {
      console.error('Error in processPayment:', error);
      return {
        success: false,
        error: 'Error al procesar el pago'
      };
    }
  }
}