package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Customer;
import com.farukgenc.boilerplate.springboot.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping("/all")
    public List<Customer> getCustomerService() {
        return customerService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Customer> getCustomerById(Long id) {
        return customerService.findById(id);
    }
}
