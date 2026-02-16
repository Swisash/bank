import { transferMoney } from "./controllers/transactionController";
import user from "./models/user";
import Counter from './models/counterModel.js';
import Transaction from './models/transaction.js';


jest.mock('./models/user', () => ({
    findById: jest.fn(),
    findOne: jest.fn()
}));

jest.mock('./models/counterModel.js', () => ({
    findOneAndUpdate: jest.fn()
}));

jest.mock('./models/transaction.js', () => ({
    create: jest.fn()
}));


describe("Check transferMoney", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body:{},
            user: {
                id:'sender123'
            }
        };


        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    })
    
    test("Check if withdraw money is possible amount = 0 ",async () => {
        
        
        req.body ={amount: 0,toEmail: 'test@test.com'};
        
        await transferMoney(req,res);
        
        expect(res.status).toHaveBeenCalledWith(400);
    });

    test("Check if withdraw money is possible amount = 150 ",async () => {
        
        
        req.body ={amount: 150,toEmail: 'test@gmail.com'};

        user.findById.mockResolvedValue({
            id: '123',
            email: 'shiran@gmail.com',
            balance: 2000,
            save: jest.fn()
        });

        user.findOne.mockResolvedValue({
            email: 'test@gmail.com',
            balance: 100,
            firstName: 'Israel',
            save: jest.fn()
        });

        Counter.findOneAndUpdate.mockResolvedValue(
            {
                sequenceValue: 1
            }
        );
        
        Transaction.create.mockResolvedValue({});
        
        await transferMoney(req,res);
        console.log(res.status.mock.calls);
        
        expect(res.status).toHaveBeenCalledWith(200);
    });
});