package com.bit.jk_fashion_system.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportPayment {

    private String count;
    private String sum;
    private String day;
}
