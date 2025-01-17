package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Customer;
import com.farukgenc.boilerplate.springboot.security.dto.CustomerDTO;
import com.farukgenc.boilerplate.springboot.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/all")
    public List<Customer> getAllCustomers() {
        return customerService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.findById(id);
    }

    @GetMapping("/phone")
    public ResponseEntity<?> buscarPorTelefono(@RequestParam Long phone) {
        return customerService.buscarPorTelefono(phone)
                .map(customer -> ResponseEntity.ok(customer))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createCustomer(@RequestBody CustomerDTO customer) {
        customerService.save(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body("Customer created");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO updatedCustomer){
        try{
            Customer updated = customerService.update(id, updatedCustomer );
            return ResponseEntity.ok("cabios guardados");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("error con la actualizacion de informacion: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        Optional<Customer> customer = customerService.findById(id);
        if (customer.isPresent()) {
            customerService.delete(customer.get());
            return ResponseEntity.ok("Customer deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
    }
}

