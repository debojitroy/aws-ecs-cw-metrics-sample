from locust import HttpUser, task, between

class Calculator(HttpUser):
    @task
    def good_operations(self):
        self.client.get("/add/1/2")
        self.client.get("/subtract/2/1")
        self.client.get("/multiply/2/3")
        self.client.get("/divide/6/3")

    @task
    def bad_operations(self):
       self.client.get("/add/a/b")
       self.client.get("/subtract/2/d")
       self.client.get("/multiply/w/3")
       self.client.get("/divide/a/f")
