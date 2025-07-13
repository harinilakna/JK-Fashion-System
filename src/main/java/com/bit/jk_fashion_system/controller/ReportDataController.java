package com.bit.jk_fashion_system.controller;

import com.bit.jk_fashion_system.dao.ReportDataDao;
import com.bit.jk_fashion_system.entity.ReportPayment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/report/data")
@RequiredArgsConstructor // this annotation is used to generate a constructor with required arguments
public class ReportDataController {

    private final ReportDataDao reportDaa;
    private final PrivilegeController privilegeController;


    @GetMapping(value = "/income", params = { "startdate", "enddate", "type" }, produces = "application/json")
    public List<ReportPayment> getIncome(@RequestParam("startdate") String startdate,
                                         @RequestParam("enddate") String enddate,
                                         @RequestParam("type") String type) {

        log.info("Start date: {}, End date: {}, Type: {}", startdate, enddate, type);

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"employee");
        if(!logUserPrivi.get("select")){
            return null;
        }

        String[][] paymentDataList = new String[10][];

        if (type.equals("Daily"))
            paymentDataList = reportDaa.getIncomeDaily(startdate, enddate);

        if (type.equals("Monthly"))
            paymentDataList = reportDaa.getIncomeMonthly(startdate, enddate);

        if (type.equals("Annually")) {

            paymentDataList = reportDaa.getIncomeAnnually(startdate, enddate);

        }

        // create array
        List<ReportPayment> reportPaymentDaily = new ArrayList<>();

        for (int i = 0; i < paymentDataList.length; i++) {

            // create object
            ReportPayment reportPayment = new ReportPayment();

            // incomeReport.setDate(reportData[i][0] +"-" + reportData[i][1] );
            reportPayment.setCount(paymentDataList[i][0]);
            reportPayment.setSum(paymentDataList[i][1]);
            reportPayment.setDay(paymentDataList[i][2]);
            // reportPayment.setDay(queryData[2]);

            // add created object to array
            reportPaymentDaily.add(reportPayment);
        }
        // return obj list
        return reportPaymentDaily;
    }


    @GetMapping(value = "/expense", params = { "startdate", "enddate", "type" }, produces = "application/json")
    public List<ReportPayment> getExpense(@RequestParam("startdate") String startdate,
                                         @RequestParam("enddate") String enddate,
                                         @RequestParam("type") String type) {

        log.info("Start date: {}, End date: {}, Type: {}", startdate, enddate, type);

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"employee");
        if(!logUserPrivi.get("select")){
            return null;
        }

        String[][] paymentDataList = new String[10][];

        if (type.equals("Daily"))
            paymentDataList = reportDaa.getExpenseDaily(startdate, enddate);

        if (type.equals("Monthly"))
            paymentDataList = reportDaa.getExpenseMonthly(startdate, enddate);

        if (type.equals("Annually")) {

            paymentDataList = reportDaa.getExpenseAnnually(startdate, enddate);

        }

        // create array
        List<ReportPayment> reportPaymentDaily = new ArrayList<>();

        for (int i = 0; i < paymentDataList.length; i++) {

            // create object
            ReportPayment reportPayment = new ReportPayment();

            // incomeReport.setDate(reportData[i][0] +"-" + reportData[i][1] );
            reportPayment.setCount(paymentDataList[i][0]);
            reportPayment.setSum(paymentDataList[i][1]);
            reportPayment.setDay(paymentDataList[i][2]);
            // reportPayment.setDay(queryData[2]);

            // add created object to array
            reportPaymentDaily.add(reportPayment);
        }
        // return obj list
        return reportPaymentDaily;
    }
}
