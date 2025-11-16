[//]: # (title: 클래스)

> 클래스를 생성하기 전에, 목적이 데이터를 저장하는 것이라면 [데이터 클래스](data-classes.md) 사용을 고려해 보세요.
> 또는 새로운 클래스를 처음부터 만드는 대신, [확장 함수](extensions.md)를 사용하여 기존 클래스를 확장하는 것을 고려해 보세요.
>
{style="tip"}

다른 객체 지향 언어와 마찬가지로, Kotlin은 재사용 가능한 구조화된 코드를 위해 데이터(프로퍼티)와 동작(함수)을 캡슐화하는 _클래스_를 사용합니다.

클래스는 객체에 대한 청사진(blueprint) 또는 템플릿(template)이며, [생성자](#constructors-and-initializer-blocks)를 통해 생성합니다. [클래스의 인스턴스를 생성](#creating-instances)할 때, 이 청사진을 기반으로 하는 구체적인 객체를 만드는 것입니다.

Kotlin은 클래스 선언을 위한 간결한 문법을 제공합니다. 클래스를 선언하려면 `class` 키워드 뒤에 클래스 이름을 사용합니다.

```kotlin
class Person { /*...*/ }
```

클래스 선언은 다음으로 구성됩니다.
*   **클래스 헤더**, 다음을 포함하지만 이에 국한되지 않음:
    *   `class` 키워드
    *   클래스 이름
    *   타입 파라미터 (있는 경우)
    *   [주 생성자](#primary-constructor) (선택 사항)
*   **클래스 본문** (선택 사항), 중괄호 `{}`로 둘러싸이며 다음 **클래스 멤버**를 포함합니다.
    *   [보조 생성자](#secondary-constructors)
    *   [초기화 블록](#initializer-blocks)
    *   [함수](functions.md)
    *   [프로퍼티](properties.md)
    *   [중첩 및 내부 클래스](nested-classes.md)
    *   [객체 선언](object-declarations.md)

클래스 헤더와 본문 모두 최소한으로 유지할 수 있습니다. 클래스에 본문이 없으면 중괄호 `{}`를 생략할 수 있습니다.

```kotlin
// 주 생성자는 있지만 본문이 없는 클래스
class Person(val name: String, var age: Int)
```

다음은 헤더와 본문을 가진 클래스를 선언하고, 그로부터 [인스턴스를 생성](#creating-instances)하는 예시입니다.

```kotlin
// name 프로퍼티를 초기화하는 주 생성자를 가진 Person 클래스
class Person(val name: String) {
    // age 프로퍼티를 가진 클래스 본문
    var age: Int = 0
}

fun main() {
    // 생성자를 호출하여 Person 클래스의 인스턴스 생성
    val person = Person("Alice")

    // 인스턴스의 프로퍼티에 접근
    println(person.name)
    // Alice
    println(person.age)
    // 0
}
```
{kotlin-runnable="true" id="class-with-header-and-body"}

## 인스턴스 생성

프로그램에서 사용할 실제 객체를 만들기 위해 클래스를 청사진으로 사용할 때 인스턴스가 생성됩니다.

클래스의 인스턴스를 생성하려면, [함수](functions.md)를 호출하는 것과 유사하게 클래스 이름 뒤에 괄호 `()`를 사용합니다.

```kotlin
// Person 클래스의 인스턴스 생성
val anonymousUser = Person()
```

Kotlin에서 인스턴스는 다음 방법으로 생성할 수 있습니다.

*   **인수 없이** (`Person()`): 클래스에 기본값이 선언된 경우 기본값을 사용하여 인스턴스를 생성합니다.
*   **인수와 함께** (`Person(value)`): 특정 값을 전달하여 인스턴스를 생성합니다.

생성된 인스턴스를 변경 가능한 (`var`) 또는 읽기 전용 (`val`) [변수](basic-syntax.md#variables)에 할당할 수 있습니다.

```kotlin
// 기본값을 사용하여 인스턴스를 생성하고 
// 변경 가능한 변수에 할당
var anonymousUser = Person()

// 특정 값을 전달하여 인스턴스를 생성하고 
// 읽기 전용 변수에 할당
val namedUser = Person("Joe")
```

인스턴스는 필요한 곳 어디에서든 생성할 수 있습니다. [`main()` 함수](basic-syntax.md#program-entry-point) 내, 다른 함수 내, 또는 다른 클래스 내에서 가능합니다. 또한, 다른 함수 내에서 인스턴스를 생성하고 `main()`에서 해당 함수를 호출할 수도 있습니다.

다음 코드는 이름을 저장하기 위한 프로퍼티를 가진 `Person` 클래스를 선언합니다. 또한 기본 생성자의 값과 특정 값을 사용하여 인스턴스를 생성하는 방법을 보여줍니다.

```kotlin
// name을 기본값으로 초기화하는 주 생성자를 가진 클래스 헤더
class Person(val name: String = "Sebastian")

fun main() {
    // 기본 생성자의 값을 사용하여 인스턴스 생성
    val anonymousUser = Person()

    // 특정 값을 전달하여 인스턴스 생성
    val namedUser = Person("Joe")

    // 인스턴스의 name 프로퍼티에 접근
    println(anonymousUser.name)
    // Sebastian
    println(namedUser.name)
    // Joe
}
```
{kotlin-runnable="true" id="create-instance-of-a-class"}

> 다른 객체 지향 프로그래밍 언어와 달리 Kotlin에서는 클래스 인스턴스를 생성할 때 `new` 키워드가 필요하지 않습니다.
>
{style="note"}

중첩, 내부, 익명 내부 클래스의 인스턴스 생성에 대한 자세한 내용은 [중첩 클래스](nested-classes.md) 섹션을 참조하세요.

## 생성자 및 초기화 블록

클래스 인스턴스를 생성할 때, 해당 클래스의 생성자 중 하나를 호출합니다. Kotlin의 클래스는 [_주 생성자_](#primary-constructor)와 하나 이상의 [_보조 생성자_](#secondary-constructors)를 가질 수 있습니다.

주 생성자는 클래스를 초기화하는 주요 방법입니다. 클래스 헤더에 선언합니다. 보조 생성자는 추가 초기화 로직을 제공하며, 클래스 본문에 선언합니다.

주 생성자와 보조 생성자는 모두 선택 사항이지만, 클래스에는 최소한 하나의 생성자가 있어야 합니다.

### 주 생성자

주 생성자는 [인스턴스가 생성](#creating-instances)될 때 초기 상태를 설정합니다.

주 생성자를 선언하려면 클래스 이름 뒤의 클래스 헤더에 위치시킵니다.

```kotlin
class Person constructor(name: String) { /*...*/ }
```

주 생성자에 [어노테이션](annotations.md)이나 [가시성 한정자](visibility-modifiers.md#constructors)가 없는 경우, `constructor` 키워드를 생략할 수 있습니다.

```kotlin
class Person(name: String) { /*...*/ }
```

주 생성자는 매개변수를 프로퍼티로 선언할 수 있습니다. 읽기 전용 프로퍼티를 선언하려면 인수 이름 앞에 `val` 키워드를 사용하고, 변경 가능한 프로퍼티에는 `var` 키워드를 사용합니다.

```kotlin
class Person(val name: String, var age: Int) { /*...*/ }
```

이러한 생성자 매개변수 프로퍼티는 인스턴스의 일부로 저장되며 클래스 외부에서 접근할 수 있습니다.

프로퍼티가 아닌 주 생성자 매개변수를 선언할 수도 있습니다. 이러한 매개변수에는 `val` 또는 `var`가 앞에 없으므로 인스턴스에 저장되지 않고 클래스 본문 내에서만 사용할 수 있습니다.

```kotlin
// 프로퍼티이기도 한 주 생성자 매개변수
class PersonWithProperty(val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}

// 프로퍼티가 아닌 주 생성자 매개변수 (프로퍼티로 저장되지 않음)
class PersonWithAssignment(name: String) {
    // 나중에 사용하려면 프로퍼티에 할당해야 함
    val displayName: String = name
    
    fun greet() {
        println("Hello, $displayName")
    }
}
```

주 생성자에 선언된 프로퍼티는 클래스의 [멤버 함수](functions.md)에서 접근할 수 있습니다.

```kotlin
// 프로퍼티를 선언하는 주 생성자를 가진 클래스
class Person(val name: String, var age: Int) {
    // 클래스 프로퍼티에 접근하는 멤버 함수
    fun introduce(): String {
        return "Hi, I'm $name and I'm $age years old."
    }
}
```

주 생성자의 프로퍼티에 기본값을 할당할 수도 있습니다.

```kotlin
class Person(val name: String = "John", var age: Int = 30) { /*...*/ }
```

[인스턴스 생성](#creating-instances) 시 생성자에 값이 전달되지 않으면 프로퍼티는 기본값을 사용합니다.

```kotlin
// name과 age에 대한 기본값을 포함하는 주 생성자를 가진 클래스
class Person(val name: String = "John", var age: Int = 30)

fun main() {
    // 기본값을 사용하여 인스턴스 생성
    val person = Person()
    println("Name: ${person.name}, Age: ${person.age}")
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-primary-constructor"}

주 생성자 매개변수를 사용하여 클래스 본문에서 추가 클래스 프로퍼티를 직접 초기화할 수 있습니다.

```kotlin
// name과 age에 대한 기본값을 포함하는 주 생성자를 가진 클래스
class Person(
    val name: String = "John",
    var age: Int = 30
) {
    // 주 생성자 매개변수로부터 description 프로퍼티 초기화
    val description: String = "Name: $name, Age: $age"
}

fun main() {
    // Person 클래스의 인스턴스 생성
    val person = Person()
    // description 프로퍼티에 접근
    println(person.description)
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-default-values"}

함수와 마찬가지로 생성자 선언에서 [후행 쉼표](coding-conventions.md#trailing-commas)를 사용할 수 있습니다.

```kotlin
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
) { /*...*/ }
```

### 초기화 블록

주 생성자는 클래스를 초기화하고 프로퍼티를 설정합니다. 대부분의 경우 간단한 코드로 처리할 수 있습니다.

[인스턴스 생성](#creating-instances) 중에 더 복잡한 작업을 수행해야 하는 경우, 해당 로직을 클래스 본문 내의 _초기화 블록_에 배치합니다. 이 블록은 주 생성자가 실행될 때 실행됩니다.

`init` 키워드 뒤에 중괄호 `{}`를 붙여 초기화 블록을 선언합니다. 중괄호 안에 초기화 중에 실행할 코드를 작성합니다.

```kotlin
// name과 age를 초기화하는 주 생성자를 가진 클래스
class Person(val name: String, var age: Int) {
    init {
        // 인스턴스가 생성될 때 초기화 블록 실행
        println("Person created: $name, age $age.")
    }
}

fun main() {
    // Person 클래스의 인스턴스 생성
    Person("John", 30)
    // Person created: John, age 30.
}
```
{kotlin-runnable="true" id="class-with-initializer-block"}

필요한 만큼의 초기화 블록(`init {}`)을 추가할 수 있습니다. 이 블록들은 프로퍼티 초기화와 함께 클래스 본문에 나타나는 순서대로 실행됩니다.

```kotlin
//sampleStart
// name과 age를 초기화하는 주 생성자를 가진 클래스
class Person(val name: String, var age: Int) {
    // 첫 번째 초기화 블록
    init {
        // 인스턴스가 생성될 때 가장 먼저 실행
        println("Person created: $name, age $age.")
    }

    // 두 번째 초기화 블록
    init {
        // 첫 번째 초기화 블록 다음에 실행
        if (age < 18) {
            println("$name is a minor.")
        } else {
            println("$name is an adult.")
        }
    }
}

fun main() {
    // Person 클래스의 인스턴스 생성
    Person("John", 30)
    // Person created: John, age 30.
    // John is an adult.
}
//sampleEnd
```
{kotlin-runnable="true" id="class-with-second-initializer-block"}

초기화 블록에서 주 생성자 매개변수를 사용할 수 있습니다. 예를 들어, 위 코드에서 첫 번째 및 두 번째 초기화 블록은 주 생성자의 `name` 및 `age` 매개변수를 사용합니다.

`init` 블록의 일반적인 사용 사례는 데이터 유효성 검사입니다. 예를 들어, [`require` 함수](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/require.html)를 호출하여 수행할 수 있습니다.

```kotlin
class Person(val age: Int) {
    init {
        require(age > 0, "age must be positive")
    }
}
```

### 보조 생성자

Kotlin에서 보조 생성자는 클래스가 주 생성자 외에 가질 수 있는 추가 생성자입니다. 보조 생성자는 클래스를 초기화하는 여러 가지 방법이 필요하거나 [Java 상호 운용성](java-to-kotlin-interop.md)을 위해 유용합니다.

보조 생성자를 선언하려면 클래스 본문 내에서 `constructor` 키워드를 사용하고 괄호 `()` 안에 생성자 매개변수를 배치합니다. 중괄호 `{}` 안에 생성자 로직을 추가합니다.

```kotlin
// name과 age를 초기화하는 주 생성자를 가진 클래스 헤더
class Person(val name: String, var age: Int) {

    // age를 String으로 받아 Int로 변환하는 보조 생성자
    constructor(name: String, age: String) : this(name, age.toIntOrNull() ?: 0) {
        println("$name created with converted age: $age")
    }
}

fun main() {
    // age를 String으로 받는 보조 생성자 사용
    Person("Bob", "8")
    // Bob created with converted age: 8
}
```
{kotlin-runnable="true" id="class-with-secondary-constructor"}

> 표현식 `age.toIntOrNull() ?: 0`은 엘비스 연산자를 사용합니다. 자세한 내용은 [널 안전성](null-safety.md#elvis-operator)을 참조하세요.
>
{style="tip"}

위 코드에서 보조 생성자는 `this` 키워드를 통해 주 생성자에 위임하며, `name`과 정수로 변환된 `age` 값을 전달합니다.

Kotlin에서 보조 생성자는 주 생성자에 위임해야 합니다. 이 위임은 모든 주 생성자 초기화 로직이 보조 생성자 로직이 실행되기 전에 실행되도록 보장합니다.

생성자 위임은 다음과 같습니다.
*   **직접 위임**: 보조 생성자가 주 생성자를 즉시 호출하는 경우.
*   **간접 위임**: 하나의 보조 생성자가 다른 보조 생성자를 호출하고, 이 다른 보조 생성자가 다시 주 생성자에 위임하는 경우.

다음은 직접 및 간접 위임이 어떻게 작동하는지 보여주는 예시입니다.

```kotlin
// name과 age를 초기화하는 주 생성자를 가진 클래스 헤더
class Person(
    val name: String,
    var age: Int
) {
    // 주 생성자에 직접 위임하는 보조 생성자
    constructor(name: String) : this(name, 0) {
        println("Person created with default age: $age and name: $name.")
    }

    // 간접 위임하는 보조 생성자: 
    // this("Bob") -> constructor(name: String) -> 주 생성자
    constructor() : this("Bob") {
        println("New person created with default age: $age and name: $name.")
    }
}

fun main() {
    // 직접 위임 기반으로 인스턴스 생성
    Person("Alice")
    // Person created with default age: 0 and name: Alice.

    // 간접 위임 기반으로 인스턴스 생성
    Person()
    // Person created with default age: 0 and name: Bob.
    // New person created with default age: 0 and name: Bob.
}
```
{kotlin-runnable="true" id="class-delegation"}

초기화 블록(`init {}`)이 있는 클래스에서는 이 블록 내의 코드가 주 생성자의 일부가 됩니다. 보조 생성자가 먼저 주 생성자에 위임하므로, 모든 초기화 블록과 프로퍼티 초기화는 보조 생성자 본문보다 먼저 실행됩니다. 클래스에 주 생성자가 없더라도 위임은 암묵적으로 발생합니다.

```kotlin
// 주 생성자가 없는 클래스 헤더
class Person {
    // 인스턴스가 생성될 때 초기화 블록 실행
    init {
        // 보조 생성자보다 먼저 실행
        println("1. First initializer block runs")
    }

    // 정수 매개변수를 받는 보조 생성자
    constructor(i: Int) {
        // 초기화 블록 다음에 실행
        println("2. Person $i is created")
    }
}

fun main() {
    // Person 클래스의 인스턴스 생성
    Person(1)
    // 1. First initializer block runs
    // 2. Person 1 created
}
```
{kotlin-runnable="true" id="class-delegation-sequence"}

### 생성자가 없는 클래스

어떤 생성자(주 생성자 또는 보조 생성자)도 선언하지 않은 클래스는 매개변수가 없는 암묵적인 주 생성자를 가집니다.

```kotlin
// 명시적 생성자가 없는 클래스
class Person {
    // 주 생성자 또는 보조 생성자가 선언되지 않음
}

fun main() {
    // 암묵적인 주 생성자를 사용하여 
    // Person 클래스의 인스턴스 생성
    val person = Person()
}
```

이 암묵적인 주 생성자의 가시성은 public이며, 이는 어디서든 접근할 수 있음을 의미합니다. 클래스가 public 생성자를 갖는 것을 원치 않는다면, 기본값이 아닌 가시성을 가진 빈 주 생성자를 선언하세요.

```kotlin
class Person private constructor() { /*...*/ }
```

> JVM에서는 모든 주 생성자 매개변수가 기본값을 가지고 있는 경우, 컴파일러가 해당 기본값을 사용하는 매개변수 없는 생성자를 암묵적으로 제공합니다.
>
> 이는 매개변수 없는 생성자를 통해 클래스 인스턴스를 생성하는 [Jackson](https://github.com/FasterXML/jackson) 또는 [Spring Data JPA](https://spring.io/projects/spring-data-jpa)와 같은 라이브러리와 Kotlin을 더 쉽게 사용할 수 있게 합니다.
>
> 다음 예시에서 Kotlin은 기본값 `""`을 사용하는 매개변수 없는 생성자 `Person()`을 암묵적으로 제공합니다.
>
> ```kotlin
> class Person(val personName: String = "")
> ```
>
{style="note"}

## 상속

Kotlin의 클래스 상속은 기존 클래스(기반 클래스)로부터 새로운 클래스(파생 클래스)를 생성하여, 해당 프로퍼티와 함수를 상속받으면서 동작을 추가하거나 수정할 수 있게 합니다.

상속 계층 및 `open` 키워드 사용 방법에 대한 자세한 내용은 [상속](inheritance.md) 섹션을 참조하세요.

## 추상 클래스

Kotlin에서 추상 클래스는 직접 인스턴스화할 수 없는 클래스입니다. 이 클래스들은 실제 동작을 정의하는 다른 클래스에 의해 상속되도록 설계되었습니다. 이러한 동작을 _구현_이라고 합니다.

추상 클래스는 추상 프로퍼티와 함수를 선언할 수 있으며, 이들은 서브클래스에서 반드시 구현되어야 합니다.

추상 클래스도 생성자를 가질 수 있습니다. 이러한 생성자는 클래스 프로퍼티를 초기화하고 서브클래스에 필요한 매개변수를 강제합니다. `abstract` 키워드를 사용하여 추상 클래스를 선언합니다.

```kotlin
abstract class Person(val name: String, val age: Int)
```

추상 클래스는 추상 및 비추상 멤버(프로퍼티 및 함수)를 모두 가질 수 있습니다. 멤버를 추상으로 선언하려면 `abstract` 키워드를 명시적으로 사용해야 합니다.

추상 클래스나 함수는 기본적으로 암묵적으로 상속 가능하므로 `open` 키워드로 어노테이션을 붙일 필요가 없습니다. `open` 키워드에 대한 자세한 내용은 [상속](inheritance.md#open-keyword)을 참조하세요.

추상 멤버는 추상 클래스에 구현을 갖지 않습니다. 구현은 서브클래스 또는 상속 클래스에서 `override` 함수나 프로퍼티를 사용하여 정의합니다.

```kotlin
// name과 age를 선언하는 주 생성자를 가진 추상 클래스
abstract class Person(
    val name: String,
    val age: Int
) {
    // 추상 멤버
    // 구현을 제공하지 않으며, 서브클래스에서 구현되어야 함
    abstract fun introduce()

    // 비추상 멤버 (구현을 가짐)
    fun greet() {
        println("Hello, my name is $name.")
    }
}

// 추상 멤버에 대한 구현을 제공하는 서브클래스
class Student(
    name: String,
    age: Int,
    val school: String
) : Person(name, age) {
    override fun introduce() {
        println("I am $name, $age years old, and I study at $school.")
    }
}

fun main() {
    // Student 클래스의 인스턴스 생성
    val student = Student("Alice", 20, "Engineering University")
    
    // 비추상 멤버 호출
    student.greet()
    // Hello, my name is Alice.
    
    // 오버라이드된 추상 멤버 호출
    student.introduce()
    // I am Alice, 20 years old, and I study at Engineering University.
}
```
{kotlin-runnable="true" id="abstract-class"}

## 동반 객체

Kotlin에서 각 클래스는 [동반 객체](object-declarations.md#companion-objects)를 가질 수 있습니다. 동반 객체는 클래스 인스턴스를 생성하지 않고 클래스 이름을 사용하여 해당 멤버에 접근할 수 있게 하는 객체 선언의 한 종류입니다.

클래스 인스턴스를 생성하지 않고 호출될 수 있지만 클래스와 논리적으로 연결된 함수(예: 팩토리 함수)를 작성해야 하는 경우, 클래스 내부에 있는 동반 [객체 선언](object-declarations.md) 안에 해당 함수를 선언할 수 있습니다.

```kotlin
// name 프로퍼티를 선언하는 주 생성자를 가진 클래스
class Person(
    val name: String
) {
    // 동반 객체를 가진 클래스 본문
    companion object {
        fun createAnonymous() = Person("Anonymous")
    }
}

fun main() {
    // 클래스 인스턴스를 생성하지 않고 함수 호출
    val anonymous = Person.createAnonymous()
    println(anonymous.name)
    // Anonymous
}
```
{kotlin-runnable="true" id="class-with-companion-object"}

클래스 내부에 동반 객체를 선언하면, 클래스 이름만 한정자로 사용하여 해당 멤버에 접근할 수 있습니다.

자세한 내용은 [동반 객체](object-declarations.md#companion-objects)를 참조하세요.