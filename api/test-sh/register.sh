curl -X POST http://localhost:4321/api/users \
    -H "Content-Type: application/json" \
    -d '{"email":"char@mail.com","password":"123456789"}' -s -w "%{http_code}" -o /dev/null