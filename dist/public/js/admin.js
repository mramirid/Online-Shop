"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function deleteProduct(button) {
    return __awaiter(this, void 0, void 0, function* () {
        const productElement = button.closest('article');
        const inputProductId = button.parentNode.querySelector('[name=productId]');
        const inputCSRF = button.parentNode.querySelector('[name=_csrf]');
        const productId = inputProductId.value;
        const csrfToken = inputCSRF.value;
        try {
            const response = yield fetch(`/admin/product/${productId}`, {
                method: 'DELETE',
                headers: { 'csrf-token': csrfToken }
            });
            if (response.status !== 200)
                throw 'Deletion failed';
            const responseBody = yield response.json();
            console.log(responseBody.message);
            productElement.remove();
        }
        catch (error) {
            console.log(error);
        }
    });
}
//# sourceMappingURL=admin.js.map