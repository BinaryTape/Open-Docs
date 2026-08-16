[//]: # (title: 코딩 컨벤션)

일반적으로 알려져 있고 따르기 쉬운 코딩 컨벤션은 모든 프로그래밍 언어에서 매우 중요합니다.
이 문서에서는 코틀린을 사용하는 프로젝트를 위한 코드 스타일 및 코드 구성 가이드를 제공합니다.

## IDE에서 스타일 설정

코틀린에서 가장 인기 있는 두 IDE인 [IntelliJ IDEA](https://www.jetbrains.com/idea/)와 [Android Studio](https://developer.android.com/studio/)는 코드 스타일링을 강력하게 지원합니다. 지정된 코드 스타일에 맞춰 코드를 자동으로 포맷하도록 IDE를 설정할 수 있습니다.

### 스타일 가이드 적용

1. **Settings/Preferences | Editor | Code Style | Kotlin**으로 이동합니다.
2. **Set from...**을 클릭합니다.
3. **Kotlin style guide**를 선택합니다.

### 코드가 스타일 가이드를 따르는지 확인

1. **Settings/Preferences | Editor | Inspections | General**로 이동합니다.
2. **Incorrect formatting** 검사를 켭니다.
스타일 가이드에 설명된 다른 문제(명명 규칙 등)를 확인하는 추가 검사는 기본적으로 활성화되어 있습니다.

<!-- 가이드가 이동되면 외부 링크로 교체 -->

자세한 내용은 [IntelliJ IDEA를 사용하여 코틀린 코드 스타일로 마이그레이션](code-style-migration-guide.md) 가이드를 참조하세요.

## 소스 코드 구성

### 디렉토리 구조

순수 코틀린 프로젝트에서 권장되는 디렉토리 구조는 공통 루트 패키지가 생략된 패키지 구조를 따릅니다. 예를 들어, 프로젝트의 모든 코드가 `org.example.kotlin` 패키지와 그 하위 패키지에 있다면, `org.example.kotlin` 패키지의 파일은 소스 루트 바로 아래에 위치해야 하며, `org.example.kotlin.network.socket`의 파일은 소스 루트의 `network/socket` 하위 디렉토리에 있어야 합니다.

> **JVM 환경:** 코틀린을 자바와 함께 사용하는 프로젝트에서 코틀린 소스 파일은 자바 소스 파일과 동일한 소스 루트에 있어야 하며, 동일한 디렉토리 구조를 따라야 합니다. 즉, 각 파일은 각 패키지 선언에 해당하는 디렉토리에 저장되어야 합니다.
>
{style="note"}

### 소스 파일 이름

코틀린 파일에 단일 클래스 또는 인터페이스(관련된 최상위 선언이 포함될 수 있음)가 포함된 경우, 파일 이름은 클래스 이름에 `.kt` 확장자를 붙인 것과 같아야 합니다. 이는 모든 유형의 클래스와 인터페이스에 적용됩니다.
파일에 여러 클래스가 포함되어 있거나 최상위 선언만 있는 경우, 파일에 포함된 내용을 설명하는 이름을 선택하여 파일 이름을 지정하세요.
각 단어의 첫 글자를 대문자로 표기하는 [어퍼 카멜 케이스(Upper camel case)](https://en.wikipedia.org/wiki/Camel_case)를 사용하세요.
예를 들어, `ProcessDeclarations.kt`와 같이 작성합니다.

파일 이름은 파일의 코드가 무엇을 하는지 설명해야 합니다. 따라서 파일 이름에 `Util`과 같이 의미 없는 단어를 사용하는 것은 피해야 합니다.

#### 멀티플랫폼 프로젝트

멀티플랫폼 프로젝트에서 플랫폼별 소스 세트에 최상위 선언이 있는 파일은 소스 세트의 이름과 관련된 접미사를 가져야 합니다. 예를 들어:

* **jvm**Main/kotlin/Platform.**jvm**.kt
* **android**Main/kotlin/Platform.**android**.kt
* **ios**Main/kotlin/Platform.**ios**.kt

공통 소스 세트(common source set)의 경우, 최상위 선언이 있는 파일에 접미사를 붙이지 않습니다. 예를 들어, `commonMain/kotlin/Platform.kt`와 같이 작성합니다.

##### 기술적 세부 사항 {initial-collapse-state="collapsed" collapsible="true"}

JVM의 제한 사항 때문에 멀티플랫폼 프로젝트에서 이 파일 명명 규칙을 따르는 것을 권장합니다. JVM은 최상위 멤버(함수, 프로퍼티)를 허용하지 않습니다.

이를 해결하기 위해 코틀린 JVM 컴파일러는 최상위 멤버 선언을 포함하는 래퍼 클래스(이른바 "파일 파사드(file facades)")를 생성합니다. 파일 파사드는 파일 이름에서 파생된 내부 이름을 갖습니다.

한편, JVM은 동일한 정규화된 이름(Fully Qualified Name, FQN)을 가진 여러 클래스를 허용하지 않습니다. 이로 인해 코틀린 프로젝트가 JVM으로 컴파일되지 않는 상황이 발생할 수 있습니다:

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // 'fun count() { }' 포함
|- jvmMain/kotlin/myPackage/Platform.kt // 'fun multiply() { }' 포함
```

여기서 두 `Platform.kt` 파일은 동일한 패키지에 있으므로, 코틀린 JVM 컴파일러는 두 개의 파일 파사드를 생성하며 두 파일 모두 FQN이 `myPackage.PlatformKt`가 됩니다. 이는 "Duplicate JVM classes" 오류를 발생시킵니다.

이를 피하는 가장 간단한 방법은 위의 가이드라인에 따라 파일 중 하나의 이름을 바꾸는 것입니다. 이 명명 규칙은 코드 가독성을 유지하면서 충돌을 피하는 데 도움이 됩니다.

> 다음 두 가지 시나리오에서는 이러한 권장 사항이 불필요해 보일 수 있지만, 여전히 따르는 것이 좋습니다.
> 
> * JVM이 아닌 플랫폼은 파일 파사드 중복 문제가 없습니다. 하지만 이 명명 규칙을 사용하면 파일 명명 방식을 일관되게 유지할 수 있습니다.
> * JVM에서 소스 파일에 최상위 선언이 없는 경우 파일 파사드가 생성되지 않으므로 이름 충돌이 발생하지 않습니다.
> 
>   하지만 이 명명 규칙을 사용하면 단순한 리팩토링이나 최상위 함수 추가로 인해 발생할 수 있는 동일한 "Duplicate JVM classes" 오류 상황을 방지할 수 있습니다.
> 
{style="tip"}

### 소스 파일 구성

선언들이 서로 의미론적으로 밀접하게 연관되어 있고 파일 크기가 적절한 수준(수백 라인을 넘지 않음)이라면, 동일한 코틀린 소스 파일에 여러 선언(클래스, 최상위 함수 또는 프로퍼티)을 배치하는 것이 권장됩니다.

특히, 특정 클래스의 모든 클라이언트와 관련이 있는 확장 함수를 정의할 때는 해당 클래스와 같은 파일에 넣으세요. 특정 클라이언트에만 의미가 있는 확장 함수를 정의할 때는 해당 클라이언트의 코드 옆에 두세요. 단순히 특정 클래스의 모든 확장 함수를 담기 위한 파일을 만드는 것은 피하세요.

### 클래스 레이아웃

클래스의 내용은 다음 순서로 배치해야 합니다:

1. 프로퍼티 선언 및 초기화 블록
2. 보조 생성자(Secondary constructors)
3. 메서드 선언
4. 컴패니언 객체(Companion object)

메서드 선언을 알파벳순이나 가시성별로 정렬하지 마세요. 또한 일반 메서드와 확장 메서드를 분리하지 마세요. 대신 관련 있는 것들을 함께 묶어 클래스를 위에서 아래로 읽는 사람이 로직의 흐름을 따라갈 수 있게 하세요. 순서(상위 수준의 내용을 먼저 배치하거나 그 반대)를 정하고 이를 일관되게 유지하세요.

중첩 클래스는 해당 클래스를 사용하는 코드 옆에 배치하세요. 클래스가 외부에서 사용되도록 의도되었고 클래스 내부에서 참조되지 않는다면, 컴패니언 객체 뒤인 맨 마지막에 배치하세요.

### 인터페이스 구현 레이아웃

인터페이스를 구현할 때는 구현 멤버들을 인터페이스의 멤버 순서와 동일하게 유지하세요(필요한 경우 구현에 사용되는 추가적인 private 메서드를 사이에 넣을 수 있습니다).

### 오버로드 레이아웃

클래스에서 오버로드된 메서드들은 항상 서로 옆에 배치하세요.

## 명명 규칙

코틀린의 패키지 및 클래스 명명 규칙은 매우 간단합니다:

* 패키지 이름은 항상 소문자이며 밑줄을 사용하지 않습니다(`org.example.project`). 여러 단어로 된 이름을 사용하는 것은 일반적으로 권장되지 않지만, 사용해야 한다면 단어를 단순히 이어 붙이거나 카멜 케이스를 사용할 수 있습니다(`org.example.myProject`).

* 클래스와 객체의 이름은 어퍼 카멜 케이스(Upper camel case)를 사용합니다:

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 함수 이름
 
함수, 프로퍼티, 지역 변수의 이름은 소문자로 시작하고 밑줄 없이 카멜 케이스를 사용합니다:

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

### 클래스 형태의 함수 이름

함수 이름이 클래스 명명 규칙을 따라야 하는 두 가지 예외가 있습니다. 이러한 종류의 함수는 주로 최상위에 정의됩니다.

* 클래스 인스턴스를 생성하는 팩토리 함수는 추상 반환 타입과 동일한 이름을 가질 수 있습니다:

   ```kotlin
   interface Foo { /*...*/ }

   class FooImpl : Foo { /*...*/ }

   fun Foo(): Foo { return FooImpl() }
   ```

* `Unit`을 반환하는 `@Composable` 함수:

   ```kotlin
   @Composable fun TabHeader { /*...*/ }
   ```

### 테스트 메서드 이름

테스트에서만(**오직** 테스트에서만), 백틱으로 감싸고 공백을 포함한 메서드 이름을 사용할 수 있습니다. 이러한 메서드 이름은 API 레벨 30부터 Android 런타임에서 지원됩니다. 테스트 코드에서는 메서드 이름에 밑줄을 사용하는 것도 허용됩니다.

```kotlin
class MyTestCase {
    @Test fun `ensure everything works`() { /*...*/ }

    @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 프로퍼티 이름

상수( `const`로 표시된 프로퍼티, 또는 커스텀 `get` 함수가 없고 깊은 불변(deeply immutable) 데이터를 보유한 최상위 또는 객체의 `val` 프로퍼티)의 이름은 [스크리밍 스네이크 케이스(Screaming snake case)](https://en.wikipedia.org/wiki/Snake_case) 컨벤션에 따라 대문자와 밑줄로 구분된 이름을 사용해야 합니다.

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

동작이 있는 객체나 가변 데이터를 보유한 최상위 또는 객체 프로퍼티의 이름은 카멜 케이스를 사용합니다:

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

싱글톤 객체에 대한 참조를 보유하는 프로퍼티 이름은 `object` 선언과 동일한 명명 스타일을 사용할 수 있습니다.

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

열거형(enum) 상수의 경우, 사용법에 따라 대문자와 밑줄로 구분된([스크리밍 스네이크 케이스](https://en.wikipedia.org/wiki/Snake_case)) 이름(`enum class Color { RED, GREEN }`) 또는 어퍼 카멜 케이스 이름을 모두 사용할 수 있습니다.
   
### 백킹 프로퍼티(Backing properties) 이름

클래스에 개념적으로는 동일하지만 하나는 공개 API의 일부이고 다른 하나는 구현 세부 사항인 두 개의 프로퍼티가 있는 경우, private 프로퍼티의 이름 접두사로 밑줄을 사용하세요.

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
        get() = _elementList
}
```

### 좋은 이름 선택하기

클래스의 이름은 대개 클래스가 무엇_인지_를 설명하는 명사나 명사구입니다: `List`, `PersonReader`.

메서드의 이름은 대개 메서드가 무엇을 _하는지_를 나타내는 동사나 동사구입니다: `close`, `readPersons`. 또한 이름은 메서드가 객체를 수정하는지 아니면 새로운 객체를 반환하는지 암시해야 합니다. 예를 들어, `sort`는 컬렉션을 제자리(in place)에서 정렬하는 반면, `sorted`는 정렬된 복사본을 반환합니다.

이름은 해당 엔티티의 목적을 명확히 해야 하므로, 이름에 의미 없는 단어(`Manager`, `Wrapper`)를 사용하는 것은 피하는 것이 좋습니다.

선언 이름의 일부로 약어(acronym)를 사용할 때는 다음 규칙을 따르세요:

* 두 글자로 된 약어는 두 글자 모두 대문자를 사용합니다. 예: `IOStream`.
* 두 글자보다 긴 약어는 첫 글자만 대문자로 표기합니다. 예: `XmlFormatter`, `HttpInputStream`.

## 포맷팅

### 들여쓰기

들여쓰기에는 4개의 스페이스를 사용하세요. 탭을 사용하지 마세요.

중괄호의 경우, 구문이 시작되는 줄 끝에 여는 중괄호를 두고, 닫는 중괄호는 여는 구문과 수평으로 맞춰 별도의 줄에 둡니다.

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

> 코틀린에서 세미콜론은 선택 사항이므로 줄 바꿈이 중요합니다. 언어 설계상 자바 스타일의 중괄호를 가정하고 있으므로, 다른 포맷팅 스타일을 사용하려고 하면 예상치 못한 동작이 발생할 수 있습니다.
>
{style="note"}

### 수평 공백

* 이항 연산자(`a + b`) 주변에 공백을 둡니다. 예외: "range to" 연산자(`0..i`) 주변에는 공백을 두지 않습니다.
* 단항 연산자(`a++`) 주변에는 공백을 두지 않습니다.
* 제어 흐름 키워드(`if`, `when`, `for`, `while`)와 그에 해당하는 여는 괄호 사이에 공백을 둡니다.
* 기본 생성자 선언, 메서드 선언 또는 메서드 호출에서 여는 괄호 앞에 공백을 두지 않습니다.

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

* `(`, `[` 뒤나 `]`, `)` 앞에 공백을 두지 마세요.
* `.` 또는 `?.` 주변에 공백을 두지 마세요: `foo.bar().filter { it > 2 }.joinToString()`, `foo?.bar()`.
* `//` 뒤에 공백을 둡니다: `// 이것은 주석입니다`.
* 타입 파라미터를 지정하는 꺽쇠 괄호 주변에 공백을 두지 마세요: `class Map<K, V> { ... }`.
* `::` 주변에 공백을 두지 마세요: `Foo::class`, `String::length`.
* 널 허용 타입을 표시하는 `?` 앞에 공백을 두지 마세요: `String?`.

일반적으로 어떤 종류의 수평 정렬도 피하세요. 식별자의 이름을 다른 길이의 이름으로 변경하더라도 선언이나 사용처의 포맷에 영향을 주어서는 안 됩니다.

### 콜론

다음 시나리오에서는 `:` 앞에 공백을 둡니다:

* 타입과 슈퍼타입을 구분할 때.
* 슈퍼클래스 생성자 또는 동일 클래스의 다른 생성자로 위임할 때.
* `object` 키워드 뒤.
    
선언과 타입을 구분할 때는 `:` 앞에 공백을 두지 않습니다.
 
`:` 뒤에는 항상 공백을 둡니다.

```kotlin
abstract class Foo<out T : Any> : IFoo {
    abstract fun foo(a: Int): T
}

class FooImpl : Foo() {
    constructor(x: String) : this(x) { /*...*/ }

    val x = object : IFoo { /*...*/ } 
}
```

### 클래스 헤더

기본 생성자 파라미터가 적은 클래스는 한 줄로 작성할 수 있습니다:

```kotlin
class Person(id: Int, name: String)
```

헤더가 긴 클래스는 각 기본 생성자 파라미터가 들여쓰기된 별도의 줄에 오도록 포맷해야 합니다. 또한 닫는 괄호는 새 줄에 있어야 합니다. 상속을 사용하는 경우, 슈퍼클래스 생성자 호출이나 구현된 인터페이스 목록은 괄호와 같은 줄에 위치해야 합니다.

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

인터페이스가 여러 개인 경우, 슈퍼클래스 생성자 호출을 먼저 배치하고 각 인터페이스를 별도의 줄에 배치해야 합니다:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

슈퍼타입 목록이 긴 클래스의 경우, 콜론 뒤에 줄 바꿈을 하고 모든 슈퍼타입 이름을 수평으로 맞춥니다:

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

클래스 헤더가 길 때 헤더와 본문을 명확하게 구분하려면, 클래스 헤더 뒤에 빈 줄을 넣거나(위 예시처럼), 여는 중괄호를 별도의 줄에 둡니다.

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

생성자 파라미터에는 일반 들여쓰기(4개의 스페이스)를 사용하세요. 이렇게 하면 기본 생성자에서 선언된 프로퍼티가 클래스 본문에 선언된 프로퍼티와 동일한 들여쓰기를 갖게 됩니다.

### 제어자 순서

선언에 여러 제어자(modifier)가 있는 경우, 항상 다음 순서로 배치하세요:

```kotlin
public / protected / private / internal
expect / actual
final / open / abstract / sealed / const
external
override
lateinit
tailrec
vararg
suspend
inner
enum / annotation / fun // `fun interface`에서 제어자로 사용될 때
companion
inline / value
infix
operator
data
```

모든 어노테이션은 제어자 앞에 배치합니다:

```kotlin
@Named("Foo")
private val foo: Foo
```

라이브러리 작업을 하는 경우가 아니라면 중복되는 제어자(예: `public`)는 생략하세요.

### 어노테이션

어노테이션은 해당 어노테이션이 붙는 선언 앞의 별도 줄에 배치하며, 동일한 들여쓰기를 사용합니다:

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

인수가 없는 어노테이션은 같은 줄에 배치할 수 있습니다:

```kotlin
@JsonExclude @JvmField
var x: String
```

인수가 없는 단일 어노테이션은 해당 선언과 같은 줄에 배치할 수 있습니다:

```kotlin
@Test fun foo() { /*...*/ }
```

### 파일 어노테이션

파일 어노테이션은 파일 주석(있는 경우) 뒤, `package` 문 앞에 배치하며, `package` 문과는 빈 줄로 구분합니다(어노테이션이 패키지가 아닌 파일을 대상으로 한다는 점을 강조하기 위함).

```kotlin
/** 라이선스, 저작권 등 */
@file:JvmName("FooBar")

package foo.bar
```

### 함수

함수 시그니처가 한 줄에 들어가지 않으면 다음 구문을 사용하세요:

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // 본문
}
```

함수 파라미터에는 일반 들여쓰기(4개의 스페이스)를 사용하세요. 이는 생성자 파라미터와의 일관성을 유지하는 데 도움이 됩니다.

본문이 단일 표현식으로 구성된 함수의 경우 표현식 본문(expression body)을 사용하는 것이 좋습니다.

```kotlin
fun foo(): Int {     // 나쁨
    return 1 
}

fun foo() = 1        // 좋음
```

### 표현식 본문(Expression bodies)

함수가 표현식 본문을 갖고 첫 번째 줄이 선언과 같은 줄에 맞지 않는 경우, 첫 번째 줄에 `=` 기호를 두고 표현식 본문을 4개의 스페이스로 들여씁니다.

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 프로퍼티

매우 단순한 읽기 전용 프로퍼티의 경우 한 줄 포맷을 고려하세요:

```kotlin
val isEmpty: Boolean get() = size == 0
```

더 복잡한 프로퍼티의 경우 항상 `get` 및 `set` 키워드를 별도의 줄에 배치하세요:

```kotlin
val foo: String
    get() { /*...*/ }
```

초기화 블록이 있는 프로퍼티의 경우, 초기화 블록이 길면 `=` 기호 뒤에 줄 바꿈을 하고 초기화 블록을 4개의 스페이스로 들여씁니다:

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 제어 흐름 문

`if` 또는 `when` 문의 조건이 여러 줄인 경우, 항상 본문 주위에 중괄호를 사용하세요. 조건의 각 후속 줄은 문 시작 부분을 기준으로 4개의 스페이스만큼 들여씁니다. 조건의 닫는 괄호와 여는 중괄호는 별도의 줄에 함께 둡니다:

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

이렇게 하면 조건과 문 본문을 정렬하는 데 도움이 됩니다.

`else`, `catch`, `finally` 키워드와 `do-while` 루프의 `while` 키워드는 이전 중괄호와 같은 줄에 둡니다:

```kotlin
if (condition) {
    // 본문
} else {
    // else 부분
}

try {
    // 본문
} finally {
    // 정리
}
```

`when` 문에서 분기가 한 줄보다 길면, 인접한 케이스 블록과 빈 줄로 구분하는 것을 고려하세요:

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken ->
            callback.visitValue(propName, token.value)

        Token.LBRACE -> { // ...
        }
    }
}
```

짧은 분기는 중괄호 없이 조건과 같은 줄에 둡니다.

```kotlin
when (foo) {
    true -> bar() // 좋음
    false -> { baz() } // 나쁨
}
```

### 메서드 호출

인수 목록이 길면 여는 괄호 뒤에 줄 바꿈을 합니다. 인수는 4개의 스페이스로 들여씁니다. 밀접하게 연관된 여러 인수는 같은 줄에 묶습니다.

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

인수 이름과 값 사이의 `=` 기호 주변에 공백을 둡니다.

### 체이닝 호출 줄 바꿈

체이닝 호출(chained calls)을 줄 바꿈할 때는 `.` 문자나 `?.` 연산자를 한 번의 들여쓰기와 함께 다음 줄에 둡니다:

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

체인의 첫 번째 호출 앞에는 대개 줄 바꿈이 있어야 하지만, 그렇게 하는 것이 코드가 더 합리적이라면 생략해도 무방합니다.

### 람다

람다 표현식에서는 중괄호 주변과 파라미터를 본문과 분리하는 화살표 주변에 공백을 사용해야 합니다. 호출이 단일 람다를 인수로 받는 경우 가능하면 괄호 밖으로 전달하세요.

```kotlin
list.filter { it > 10 }
```

람다에 레이블을 할당할 때는 레이블과 여는 중괄호 사이에 공백을 두지 마세요:

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

여러 줄 람다에서 파라미터 이름을 선언할 때는 첫 번째 줄에 이름을 두고, 그 뒤에 화살표와 줄 바꿈을 둡니다:

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

파라미터 목록이 너무 길어 한 줄에 들어가지 않으면 화살표를 별도의 줄에 둡니다:

```kotlin
foo {
    context: Context,
    environment: Env
    ->
    context.configureEnv(environment)
}
```

### 트레일링 콤마(Trailing commas)

트레일링 콤마(Trailing comma)는 일련의 요소 중 마지막 항목 뒤에 붙는 쉼표 기호입니다:

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // 트레일링 콤마
)
```

트레일링 콤마를 사용하면 다음과 같은 장점이 있습니다:

* 변경된 값에만 집중할 수 있어 버전 관리 시의 diff가 더 깔끔해집니다.
* 요소를 추가하거나 순서를 바꿀 때 쉼표를 추가하거나 삭제할 필요가 없어 요소 조작이 쉬워집니다.
* 객체 초기화 등과 같은 코드 생성을 단순화합니다. 마지막 요소에도 쉼표가 있을 수 있기 때문입니다.

트레일링 콤마는 완전히 선택 사항이며, 없이도 코드는 정상적으로 작동합니다. 코틀린 스타일 가이드는 선언 위치에서 트레일링 콤마 사용을 권장하며, 호출 위치에서의 사용은 사용자의 재량에 맡깁니다.

IntelliJ IDEA 포맷터에서 트레일링 콤마를 활성화하려면 **Settings/Preferences | Editor | Code Style | Kotlin**으로 이동하여 **Other** 탭을 열고 **Use trailing comma** 옵션을 선택하세요.

#### 열거형(Enumerations) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // 트레일링 콤마
}
```

#### 값 인수(Value arguments) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // 트레일링 콤마
)
val colors = listOf(
    "red",
    "green",
    "blue", // 트레일링 콤마
)
```

#### 클래스 프로퍼티 및 파라미터 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Customer(
    val name: String,
    val lastName: String, // 트레일링 콤마
)
class Customer(
    val name: String,
    lastName: String, // 트레일링 콤마
)
```

#### 함수 값 파라미터 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun powerOf(
    number: Int, 
    exponent: Int, // 트레일링 콤마
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // 트레일링 콤마
) {}
fun print(
    vararg quantity: Int,
    description: String, // 트레일링 콤마
) {}
```

#### 선택적 타입이 있는 파라미터(세터 포함) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
val sum: (Int, Int, Int) -> Int = fun(
    x,
    y,
    z, // 트레일링 콤마
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### 인덱싱 접미사(Indexing suffix) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // 트레일링 콤마
    ]
```

#### 람다 파라미터 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // 트레일링 콤마
        ->
        println("1")
    }
    println(x)
}
```

#### when 엔트리 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // 트레일링 콤마
        -> true
    else -> false
}
```

#### 컬렉션 리터럴(어노테이션 내) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // 트레일링 콤마
])
fun run() {}
```

#### 타입 인수(Type arguments) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // 트레일링 콤마
            >()
}
```

#### 타입 파라미터 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class MyMap<
        MyKey,
        MyValue, // 트레일링 콤마
        > {}
```

#### 구조 분해 선언(Destructuring declarations) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // 트레일링 콤마
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // 트레일링 콤마
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## 문서 주석

긴 문서 주석의 경우 여는 `/**`를 별도의 줄에 두고 그 이후의 각 줄은 별표로 시작합니다:

```kotlin
/**
 * 이것은 여러 줄로 구성된
 * 문서 주석입니다.
 */
```

짧은 주석은 한 줄에 배치할 수 있습니다:

```kotlin
/** 이것은 짧은 문서 주석입니다. */
```

일반적으로 `@param` 및 `@return` 태그의 사용을 피하세요. 대신 파라미터와 반환 값에 대한 설명을 문서 주석에 직접 포함하고, 언급된 파라미터에는 링크를 추가하세요. `@param` 및 `@return`은 본문의 흐름에 맞지 않는 긴 설명이 필요한 경우에만 사용하세요.

```kotlin
// 이렇게 하지 마세요:

/**
 * 주어진 숫자의 절대값을 반환합니다.
 * @param number 절대값을 반환할 숫자.
 * @return 절대값.
 */
fun abs(number: Int): Int { /*...*/ }

// 대신 이렇게 하세요:

/**
 * 주어진 [number]의 절대값을 반환합니다.
 */
fun abs(number: Int): Int { /*...*/ }
```

## 불필요한 구문 피하기

일반적으로 코틀린의 특정 구문이 선택 사항이고 IDE에서 불필요한 것으로 강조 표시된다면 코드에서 생략해야 합니다. "명확성을 위해"라는 이유로 코드에 불필요한 구문 요소를 남겨두지 마세요.

### Unit 반환 타입

함수가 Unit을 반환하는 경우 반환 타입을 생략해야 합니다:

```kotlin
fun foo() { // 여기서 ": Unit"은 생략됨

}
```

### 세미콜론

가능하면 세미콜론을 생략하세요.

### 문자열 템플릿

문자열 템플릿에 단순 변수를 삽입할 때는 중괄호를 사용하지 마세요. 긴 표현식에만 중괄호를 사용하세요:

```kotlin
println("$name has ${children.size} children")
```

달러 기호(`$`) 문자를 문자열 리터럴로 취급하려면 [멀티 달러 문자열 보간(Multi-dollar string interpolation)](strings.md#multi-dollar-string-interpolation)을 사용하세요:

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
        {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "$id": "https://example.com/product.schema.json",
            "$dynamicAnchor": "meta",
            "title": "${simpleName ?: qualifiedName ?: "unknown"}",
            "type": "object"
        }
        """