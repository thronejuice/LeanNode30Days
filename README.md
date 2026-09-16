# LeanNode30Days

บันทึกการเรียน Node.js แบบลงมือทำต่อเนื่อง 30 วัน โดยเป้าหมายคือเปลี่ยนจากโจทย์ JavaScript ขนาดเล็กให้กลายเป็นโปรเจกต์ backend ที่อธิบายได้ ทดสอบได้ และนำไปใส่ใน portfolio หรือ CV ได้จริง

## เป้าหมายการเรียน 30 วัน

- เข้าใจ JavaScript ที่จำเป็นต่อการทำงานฝั่ง server: function, array methods, error handling และ asynchronous programming
- สร้าง HTTP server ด้วย Node.js core และเข้าใจ request, response, status code และ JSON
- ใช้ Express เพื่อจัดการ routing, middleware, validation และ error handling อย่างเป็นระบบ
- เรียนรู้การออกแบบ REST API, การเก็บข้อมูล, authentication, testing และการ deploy
- ส่งมอบโปรเจกต์หลักหนึ่งชิ้นที่มี README, API documentation, automated tests และประวัติ commit ที่สื่อสารพัฒนาการได้

## เส้นทาง 30 วัน

| ช่วง | วัน | หัวข้อ | ผลลัพธ์ที่ต้องส่งมอบ |
| --- | --- | --- | --- |
| พื้นฐาน JavaScript | 1-5 | function, array methods, object, module และการจัดการ error | utility functions พร้อมตัวอย่าง input/output |
| Asynchronous Node.js | 6-9 | callback, Promise, async/await และการอ่าน configuration จาก environment | service จำลองที่โหลดข้อมูลและจัดการ failure ได้ |
| HTTP และ Express | 10-14 | `node:http`, Express, routing, middleware และ status code | Candidate API เวอร์ชันแรก |
| ออกแบบ Task Hub | 15-18 | REST conventions, resource modeling, validation และ pagination | API contract และโครงสร้างโปรเจกต์ที่ชัดเจน |
| Data และความปลอดภัย | 19-23 | database, migrations, authentication, authorization และ input sanitization | Task Hub API ที่เก็บข้อมูลจริงและป้องกัน route สำคัญ |
| คุณภาพและการส่งมอบ | 24-27 | unit/integration tests, logging, error response และ API documentation | test suite, health check และ OpenAPI หรือเอกสาร endpoint |
| Portfolio readiness | 28-30 | refactor, deploy, README, demo และทบทวนบทเรียน | โปรเจกต์พร้อมสาธิตและ bullet สำหรับ CV |

## โปรเจกต์หลัก: Task Hub API

### เป้าหมาย

สร้าง REST API สำหรับจัดการงานส่วนตัวหรือทีมขนาดเล็ก ผู้ใช้สามารถสร้างงาน กำหนดสถานะและความสำคัญ มอบหมายงาน เพิ่มกำหนดส่ง และกรองงานเพื่อเห็นสิ่งที่ต้องทำต่อไปได้อย่างรวดเร็ว

### ขอบเขตเวอร์ชันแรก

- ผู้ใช้สมัครและเข้าสู่ระบบด้วย email/password
- ผู้ใช้จัดการ task ของตนเอง และเข้าถึงเฉพาะข้อมูลที่มีสิทธิ์
- task มี title, description, status, priority, due date, assignee และ timestamps
- รองรับการค้นหา กรองตามสถานะ/ความสำคัญ และแบ่งหน้า
- มี validation ที่ขอบเขต API และ response error format เดียวกัน
- มี health check, logging และ test สำหรับ business rules กับ endpoint สำคัญ

### สถานะของ task

`todo` -> `in_progress` -> `done`

อนุญาตให้ย้อนกลับจาก `in_progress` ไป `todo` ได้ และอนุญาตให้ย้ายจาก `done` กลับมา `in_progress` เมื่อมีการแก้ไขงาน

### API ที่วางไว้

| Method | Endpoint | หน้าที่ | Auth |
| --- | --- | --- | --- |
| `GET` | `/health` | ตรวจสอบว่า service ทำงานอยู่ | ไม่ต้องใช้ |
| `POST` | `/auth/register` | สร้างผู้ใช้ใหม่ | ไม่ต้องใช้ |
| `POST` | `/auth/login` | เข้าสู่ระบบและรับ token | ไม่ต้องใช้ |
| `GET` | `/tasks` | ดูรายการ task พร้อม filter และ pagination | ต้องใช้ |
| `POST` | `/tasks` | สร้าง task | ต้องใช้ |
| `GET` | `/tasks/:id` | ดูรายละเอียด task | ต้องใช้ |
| `PATCH` | `/tasks/:id` | แก้ไข task หรือเปลี่ยนสถานะ | ต้องใช้ |
| `DELETE` | `/tasks/:id` | ลบ task | ต้องใช้ |

ตัวอย่าง query สำหรับรายการ task:

```text
GET /tasks?status=in_progress&priority=high&page=1&limit=20
```

ตัวอย่าง response ที่ควรรักษาให้สม่ำเสมอ:

```json
{
	"data": [],
	"meta": {
		"page": 1,
		"limit": 20,
		"total": 0
	}
}
```

### แนวทางเทคนิค

- Node.js และ Express เป็น runtime/framework หลัก
- แยก route, controller, service, repository และ validation ออกจากกันเมื่อโค้ดเริ่มโต
- ใช้ environment variables สำหรับ port, database URL และ secret; ห้าม commit secret ลง repository
- ใช้ relational database พร้อม migration เพื่อให้ schema reproducible
- ใช้ token-based authentication และ hash password ด้วย library ที่เหมาะสม
- เพิ่ม unit tests สำหรับ service และ integration tests สำหรับ API ที่สำคัญ
- ส่ง error ในรูปแบบเดียวกัน เช่น `{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }`

### Definition of Done

- ผู้ใช้ที่ไม่มีสิทธิ์ไม่สามารถอ่านหรือแก้ไข task ของผู้อื่นได้
- validation ปฏิเสธข้อมูลไม่ครบหรือสถานะที่ไม่ถูกต้องด้วย status code ที่เหมาะสม
- happy path และ failure path ของ endpoint หลักมี automated tests
- มีคำสั่งติดตั้ง รัน test และ start service ที่ทำตามได้จาก README
- มีตัวอย่าง request/response และ deployment URL หรือวิธีรันในเครื่อง

## สิ่งที่ทำไว้แล้ว

- `app.js` และ `app2.js`: ฝึก filter, reduce, summary และ edge case ของข้อมูลว่าง
- `app3.js`: ฝึก Promise, `async/await` และ error handling
- `app4.js`: สร้าง HTTP API ด้วย Node.js core
- `app5.js`: ย้ายมาใช้ Express, JSON middleware และ API key middleware
- `app6.js`: อ่าน command-line argument และข้อมูล runtime ของ Node.js

## ตัวอย่าง bullet สำหรับ CV

ปรับคำกริยาและตัวเลขให้ตรงกับผลลัพธ์จริงหลังโปรเจกต์เสร็จ:

- Built a RESTful Task Management API with Node.js and Express, supporting task CRUD, filtering, pagination, validation, and consistent error responses.
- Designed authenticated task workflows with role-aware access control, password hashing, and protected resources to prevent unauthorized data access.
- Added unit and integration tests for task business rules and API endpoints, improving confidence in status transitions and validation failures.
- Implemented structured logging, health checks, environment-based configuration, and database migrations for a reproducible deployment workflow.
- Documented API contracts with request/response examples and deployed the service for portfolio demonstration.

## Checklist ก่อนยื่นสมัครงาน

- [ ] อธิบาย architecture และเหตุผลที่เลือกใช้ Node.js/Express ได้ภายใน 2 นาที
- [ ] โปรเจกต์รันได้จากคำสั่งใน README บนเครื่องใหม่
- [ ] มี `.env.example` และไม่มี secret, token หรือ password ใน Git history
- [ ] มี tests ที่รันผ่าน และรู้ว่า coverage ยังขาดส่วนใด
- [ ] API response, status code, validation และ authentication ทำงานสอดคล้องกัน
- [ ] มีตัวอย่าง request/response หรือ OpenAPI documentation
- [ ] มี deployed demo หรือขั้นตอนรันด้วย Docker/บริการ cloud
- [ ] README ระบุปัญหาที่แก้, trade-off, สิ่งที่เรียนรู้ และงานที่ยังทำต่อ
- [ ] ตรวจ CV ให้ bullet เริ่มด้วย action verb และมีผลลัพธ์ที่วัดได้เมื่อมีข้อมูล
- [ ] เตรียมอธิบาย bug หนึ่งเรื่อง, การตัดสินใจด้าน design หนึ่งเรื่อง และสิ่งที่จะปรับปรุงหนึ่งเรื่อง

## คำสั่งเริ่มต้น

```bash
npm install
node app.js
```

ตัวอย่าง Express API ปัจจุบันอยู่ใน `app5.js` และสามารถกำหนด port ผ่าน `PORT` ได้:

```bash
PORT=3000 node app5.js
```