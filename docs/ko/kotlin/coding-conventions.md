[//]: # (title: 코딩 컨벤션)

일반적으로 알려져 있고 따르기 쉬운 코딩 컨벤션은 모든 프로그래밍 언어에 필수적입니다.
여기에서는 Kotlin을 사용하는 프로젝트의 코드 스타일 및 코드 구성에 대한 가이드라인을 제공합니다.

## IDE에서 스타일 구성하기

Kotlin을 위한 가장 인기 있는 두 가지 IDE인 [IntelliJ IDEA](https://www.jetbrains.com/idea/)와 [Android Studio](https://developer.android.com/studio/)는
코드 스타일링에 강력한 지원을 제공합니다. 이를 구성하여 주어진 코드 스타일에 맞춰 코드를 자동으로 포맷할 수 있습니다.
 
### 스타일 가이드 적용하기

1. **Settings/Preferences | Editor | Code Style | Kotlin**으로 이동합니다.
2. **Set from...**을 클릭합니다.
3. **Kotlin style guide**를 선택합니다.

### 코드가 스타일 가이드를 따르는지 확인하기

1. **Settings/Preferences | Editor | Inspections | General**로 이동합니다.
2. **Incorrect formatting** 검사를 켭니다.
스타일 가이드에 설명된 다른 문제(예: 명명 규칙)를 확인하는 추가 검사는 기본적으로 활성화되어 있습니다.

## 소스 코드 구성

### 디렉토리 구조

순수 Kotlin 프로젝트에서 권장되는 디렉토리 구조는 공통 루트 패키지를 생략한 패키지 구조를 따릅니다. 예를 들어, 프로젝트의 모든 코드가 `org.example.kotlin` 패키지 및 그
하위 패키지에 있다면, `org.example.kotlin` 패키지의 파일은 소스 루트 바로 아래에 배치되어야 하며,
`org.example.kotlin.network.socket`의 파일은 소스 루트의 `network/socket` 하위 디렉토리에 있어야 합니다.

>JVM에서: Kotlin이 Java와 함께 사용되는 프로젝트에서는 Kotlin 소스 파일이 Java 소스 파일과 동일한
>소스 루트에 있어야 하며, 동일한 디렉토리 구조를 따라야 합니다. 즉, 각 파일은 해당 패키지 선언에 해당하는
>디렉토리에 저장되어야 합니다.
>
{style="note"}

### 소스 파일 이름

Kotlin 파일에 단일 클래스 또는 인터페이스(관련된 최상위 선언을 포함할 수 있음)가 포함되어 있다면, 해당 이름은 클래스의 이름과 동일해야 하며, `.kt` 확장자가 추가되어야 합니다. 이는 모든 유형의 클래스 및 인터페이스에 적용됩니다.
파일에 여러 클래스 또는 최상위 선언만 포함된 경우, 파일에 포함된 내용을 설명하는 이름을 선택하고 그에 따라 파일 이름을 지정합니다.
각 단어의 첫 글자를 대문자로 표기하는 [어퍼 카멜 케이스(upper camel case)](https://en.wikipedia.org/wiki/Camel_case)를 사용합니다.
예를 들어, `ProcessDeclarations.kt`와 같습니다.

파일 이름은 파일에 있는 코드가 무엇을 하는지 설명해야 합니다. 따라서 파일 이름에 `Util`과 같은 의미 없는 단어를 사용하는 것을 피해야 합니다.

#### 멀티플랫폼 프로젝트

멀티플랫폼 프로젝트에서 플랫폼별 소스 세트의 최상위 선언이 포함된 파일은 소스 세트의 이름과 연결된 접미사를 가져야 합니다. 예를 들면 다음과 같습니다.

* **jvm**Main/kotlin/Platform.**jvm**.kt
* **android**Main/kotlin/Platform.**android**.kt
* **ios**Main/kotlin/Platform.**ios**.kt

공통 소스 세트의 경우, 최상위 선언이 포함된 파일은 접미사를 가지지 않아야 합니다. 예를 들어, `commonMain/kotlin/Platform.kt`와 같습니다.

##### 기술적 세부 정보 {initial-collapse-state="collapsed" collapsible="true"}

JVM의 제한 사항(최상위 멤버(함수, 프로퍼티)를 허용하지 않음)으로 인해 멀티플랫폼 프로젝트에서 이 파일 명명 체계를 따르는 것을 권장합니다.

이를 해결하기 위해 Kotlin JVM 컴파일러는 최상위 멤버 선언을 포함하는 래퍼 클래스(소위 "파일 파사드(file facades)")를 생성합니다. 파일 파사드는 파일 이름에서 파생된 내부 이름을 가집니다.

차례로 JVM은 동일한 정규화된 이름(FQN)을 가진 여러 클래스를 허용하지 않습니다. 이로 인해 Kotlin 프로젝트가 JVM으로 컴파일되지 않는 상황이 발생할 수 있습니다.

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

여기서 두 `Platform.kt` 파일은 동일한 패키지에 있으므로, Kotlin JVM 컴파일러는 두 개의 파일 파사드를 생성하며, 둘 다 FQN이 `myPackage.PlatformKt`입니다. 이는 "Duplicate JVM classes" 오류를 발생시킵니다.

이를 피하는 가장 간단한 방법은 위 가이드라인에 따라 파일 중 하나를 이름을 변경하는 것입니다. 이 명명 체계는 코드 가독성을 유지하면서 충돌을 피하는 데 도움이 됩니다.

>다음 두 가지 시나리오에서는 이러한 권장 사항이 불필요해 보일 수 있지만, 여전히 따르는 것을 권장합니다.
>
>* 비 JVM 플랫폼은 파일 파사드 중복 문제와 관련이 없습니다. 그러나 이 명명 체계는 파일 명명을 일관성 있게 유지하는 데 도움이 될 수 있습니다.
>* JVM에서는 소스 파일에 최상위 선언이 없는 경우 파일 파사드가 생성되지 않아 명명 충돌이 발생하지 않습니다.
>
>  그러나 이 명명 체계는 간단한 리팩토링이나 추가로 인해 최상위 함수가 포함되고 동일한 "Duplicate JVM classes" 오류가 발생하는 상황을 피하는 데 도움이 될 수 있습니다.
>
{style="tip"}

### 소스 파일 구성

여러 선언(클래스, 최상위 함수 또는 프로퍼티)을 동일한 Kotlin 소스 파일에 배치하는 것은 이러한 선언이 의미론적으로 서로 밀접하게 관련되어 있고 파일 크기가 합리적(수백 라인을 초과하지 않음)인 한 권장됩니다.

특히, 클래스의 모든 클라이언트에게 관련성이 있는 클래스에 대한 확장 함수를 정의할 때는 클래스 자체와 같은 파일에 배치합니다. 특정 클라이언트에게만 의미가 있는 확장 함수를 정의할 때는 해당 클라이언트의 코드 옆에 배치합니다. 특정 클래스의 모든 확장 함수를 담기 위한 파일만 생성하는 것은 피해야 합니다.

### 클래스 레이아웃

클래스의 내용은 다음 순서로 작성해야 합니다.

1. 프로퍼티 선언 및 초기화 블록
2. 보조 생성자(secondary constructors)
3. 메서드 선언
4. 컴패니언 객체(Companion object)

메서드 선언을 알파벳 순서나 가시성에 따라 정렬하지 말고, 일반 메서드와 확장 메서드를 분리하지 마십시오. 대신, 관련 있는 내용을 함께 배치하여 클래스를 위에서 아래로 읽는 사람이 어떤 일이 일어나는지 논리를 따라갈 수 있도록 하십시오. 순서(상위 레벨 내용 먼저 또는 그 반대)를 선택하고 이를 고수하십시오.

중첩된 클래스는 해당 클래스를 사용하는 코드 옆에 배치합니다. 클래스가 외부에서 사용될 목적으로 클래스 내에서 참조되지 않는 경우, 컴패니언 객체 뒤에 마지막에 배치합니다.

### 인터페이스 구현 레이아웃

인터페이스를 구현할 때, 구현하는 멤버는 인터페이스 멤버와 동일한 순서로 유지합니다(필요한 경우, 구현에 사용되는 추가 private 메서드를 중간에 삽입할 수 있습니다).

### 오버로드 레이아웃

클래스에서 오버로드된 함수들을 항상 서로 옆에 배치합니다.

## 명명 규칙

Kotlin의 패키지 및 클래스 명명 규칙은 매우 간단합니다.

* 패키지 이름은 항상 소문자이며 밑줄을 사용하지 않습니다(`org.example.project`). 여러 단어로 된 이름을 사용하는 것은 일반적으로 권장되지 않지만, 여러 단어를 사용해야 하는 경우 단순히 단어들을 연결하거나 카멜 케이스(`org.example.myProject`)를 사용할 수 있습니다.

* 클래스 및 객체 이름은 어퍼 카멜 케이스를 사용합니다.

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 함수 이름
 
함수, 프로퍼티 및 지역 변수의 이름은 소문자로 시작하며 밑줄 없이 카멜 케이스를 사용합니다.

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

예외: 클래스 인스턴스를 생성하는 데 사용되는 팩토리 함수는 추상 반환 타입과 동일한 이름을 가질 수 있습니다.

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### 테스트 메서드 이름

테스트에서 (그리고 **테스트에서만**), 백틱으로 묶인 공백이 포함된 메서드 이름을 사용할 수 있습니다.
이러한 메서드 이름은 API 레벨 30부터 Android 런타임에서만 지원됩니다. 메서드 이름의 밑줄 또한 테스트 코드에서 허용됩니다.

```kotlin
class MyTestCase {
    @Test fun `ensure everything works`() { /*...*/ }

    @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 프로퍼티 이름

상수 이름(`const`로 표시된 프로퍼티 또는 사용자 정의 `get` 함수가 없으며 깊이 변경 불가능한 데이터를 보유하는 최상위 또는 객체 `val` 프로퍼티)은 [스크리밍 스네이크 케이스(screaming snake case)](https://en.wikipedia.org/wiki/Snake_case) 규칙을 따르는 모든 대문자, 밑줄로 구분된 이름을 사용해야 합니다.

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

동작을 가진 객체나 변경 가능한 데이터를 보유하는 최상위 또는 객체 프로퍼티 이름은 카멜 케이스 이름을 사용해야 합니다.

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

싱글톤 객체에 대한 참조를 보유하는 프로퍼티 이름은 `object` 선언과 동일한 명명 스타일을 사용할 수 있습니다.

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

enum 상수에는 사용법에 따라 모든 대문자, 밑줄로 구분된 이름([스크리밍 스네이크 케이스(screaming snake case)](https://en.wikipedia.org/wiki/Snake_case))(`enum class Color { RED, GREEN }`) 또는 어퍼 카멜 케이스 이름을 사용하는 것이 좋습니다.
   
### 배킹 프로퍼티(Backing properties) 이름

클래스에 개념적으로 동일하지만 하나는 public API의 일부이고 다른 하나는 구현 세부 사항인 두 개의 프로퍼티가 있는 경우, private 프로퍼티 이름에 밑줄을 접두사로 사용합니다.

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
        get() = _elementList
}
```

### 좋은 이름 선택하기

클래스 이름은 일반적으로 클래스가 _무엇인지_ 설명하는 명사 또는 명사구입니다: `List`, `PersonReader`.

메서드 이름은 일반적으로 메서드가 _무엇을 하는지_ 말하는 동사 또는 동사구입니다: `close`, `readPersons`.
이름은 또한 메서드가 객체를 변경하는지 또는 새 객체를 반환하는지 나타내야 합니다. 예를 들어 `sort`는 컬렉션을 제자리에서 정렬하는 반면, `sorted`는 컬렉션의 정렬된 복사본을 반환합니다.

이름은 엔티티의 목적을 명확히 해야 하므로, 이름에 의미 없는 단어(`Manager`, `Wrapper`)를 사용하는 것을 피하는 것이 가장 좋습니다.

선언 이름의 일부로 약어를 사용할 때는 다음 규칙을 따르십시오.

* 두 글자 약어의 경우, 두 글자 모두 대문자를 사용합니다. 예를 들어, `IOStream`.
* 두 글자보다 긴 약어의 경우, 첫 글자만 대문자로 표기합니다. 예를 들어, `XmlFormatter` 또는 `HttpInputStream`.

## 포맷팅

### 들여쓰기

들여쓰기는 네 칸 공백을 사용합니다. 탭을 사용하지 마십시오.

중괄호의 경우, 여는 중괄호는 구문이 시작되는 줄의 끝에, 닫는 중괄호는 여는 구문과 수평으로 정렬된 별도의 줄에 배치합니다.

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

>Kotlin에서는 세미콜론이 선택 사항이므로 줄 바꿈이 중요합니다. 언어 디자인은 Java 스타일 중괄호를 가정하며, 다른 포맷팅 스타일을 사용하려고 하면 예기치 않은 동작이 발생할 수 있습니다.
>
{style="note"}

### 가로 공백

* 이항 연산자 주위에 공백을 넣습니다(`a + b`). 예외: "범위 지정(range to)" 연산자 주위에는 공백을 넣지 않습니다(`0..i`).
* 단항 연산자 주위에는 공백을 넣지 않습니다(`a++`).
* 제어 흐름 키워드(`if`, `when`, `for`, `while`)와 해당 여는 괄호 사이에 공백을 넣습니다.
* 주 생성자 선언, 메서드 선언 또는 메서드 호출에서 여는 괄호 앞에 공백을 넣지 않습니다.

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

* `(`, `[` 뒤 또는 `]`, `)` 앞에 절대로 공백을 넣지 않습니다.
* `.` 또는 `?.` 주위에 절대로 공백을 넣지 않습니다: `foo.bar().filter { it > 2 }.joinToString()`, `foo?.bar()`.
* `//` 뒤에 공백을 넣습니다: `// This is a comment`.
* 타입 매개변수를 지정하는 데 사용되는 꺽쇠 괄호 주위에 공백을 넣지 않습니다: `class Map<K, V> { ... }`.
* `::` 주위에 공백을 넣지 않습니다: `Foo::class`, `String::length`.
* 널 허용 타입(nullable type)을 표시하는 데 사용되는 `?` 앞에 공백을 넣지 않습니다: `String?`.

일반적인 규칙으로, 어떤 종류의 가로 정렬도 피하십시오. 식별자 이름을 다른 길이의 이름으로 변경하는 것이 선언 또는 사용처의 포맷팅에 영향을 주어서는 안 됩니다.

### 콜론

다음 시나리오에서는 `:` 앞에 공백을 넣습니다.

* 타입과 슈퍼타입을 구분하는 데 사용될 때.
* 슈퍼클래스 생성자 또는 동일 클래스의 다른 생성자에 위임할 때.
* `object` 키워드 뒤에.
    
선언과 해당 타입을 구분할 때는 `:` 앞에 공백을 넣지 마십시오.
 
`:` 뒤에는 항상 공백을 넣으십시오.

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

주 생성자 매개변수가 몇 개 없는 클래스는 한 줄로 작성할 수 있습니다.

```kotlin
class Person(id: Int, name: String)
```

헤더가 긴 클래스는 각 주 생성자 매개변수가 들여쓰기와 함께 별도의 줄에 있도록 포맷해야 합니다.
또한, 닫는 괄호는 새 줄에 있어야 합니다. 상속을 사용하는 경우, 슈퍼클래스 생성자 호출 또는 
구현된 인터페이스 목록은 괄호와 같은 줄에 위치해야 합니다.

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

여러 인터페이스의 경우, 슈퍼클래스 생성자 호출이 먼저 위치해야 하고 그 다음 각 인터페이스가
다른 줄에 위치해야 합니다.

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

슈퍼타입 목록이 긴 클래스의 경우, 콜론 뒤에 줄 바꿈을 넣고 모든 슈퍼타입 이름을 수평으로 정렬합니다.

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

클래스 헤더가 길 때 클래스 헤더와 본문을 명확하게 구분하려면, 클래스 헤더 뒤에 빈 줄을 넣거나(위 예시처럼), 여는 중괄호를 별도의 줄에 배치합니다.

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

생성자 매개변수에 일반 들여쓰기(네 칸 공백)를 사용합니다. 이렇게 하면 주 생성자에서 선언된 프로퍼티가 클래스 본문에 선언된 프로퍼티와 동일한 들여쓰기를 갖도록 보장합니다.

### 수식어 순서

선언에 여러 수식어(modifier)가 있는 경우, 항상 다음 순서로 배치합니다.

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
enum / annotation / fun // as a modifier in `fun interface` 
companion
inline / value
infix
operator
data
```

모든 어노테이션은 수식어 앞에 배치합니다.

```kotlin
@Named("Foo")
private val foo: Foo
```

라이브러리 작업을 하지 않는 한, 불필요한 수식어(예: `public`)는 생략합니다.

### 어노테이션

어노테이션은 선언 앞에 별도의 줄에 배치하며, 동일한 들여쓰기를 사용합니다.

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

인수가 없는 어노테이션은 같은 줄에 배치할 수 있습니다.

```kotlin
@JsonExclude @JvmField
var x: String
```

인수가 없는 단일 어노테이션은 해당 선언과 같은 줄에 배치할 수 있습니다.

```kotlin
@Test fun foo() { /*...*/ }
```

### 파일 어노테이션

파일 어노테이션은 파일 주석(있는 경우) 뒤에, `package` 문 앞에 배치되며, `package` 문과는 빈 줄로 구분됩니다(파일을 대상으로 하며 패키지를 대상으로 하지 않는다는 사실을 강조하기 위해).

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 함수

함수 시그니처가 한 줄에 맞지 않으면 다음 구문을 사용합니다.

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

함수 매개변수에 일반 들여쓰기(네 칸 공백)를 사용합니다. 이는 생성자 매개변수와의 일관성을 보장하는 데 도움이 됩니다.

본문이 단일 표현식으로 구성된 함수에는 표현식 본문을 사용하는 것을 선호합니다.

```kotlin
fun foo(): Int {     // bad
    return 1 
}

fun foo() = 1        // good
```

### 표현식 본문

함수가 표현식 본문을 가지고 있고, 그 첫 줄이 선언과 같은 줄에 맞지 않으면, `=` 기호를 첫 줄에 배치하고 표현식 본문을 네 칸 들여씁니다.

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 프로퍼티

매우 간단한 읽기 전용 프로퍼티의 경우 한 줄 포맷팅을 고려합니다.

```kotlin
val isEmpty: Boolean get() = size == 0
```

더 복잡한 프로퍼티의 경우, 항상 `get` 및 `set` 키워드를 별도의 줄에 배치합니다.

```kotlin
val foo: String
    get() { /*...*/ }
```

초기화 구문이 긴 프로퍼티의 경우, `=` 기호 뒤에 줄 바꿈을 추가하고 초기화 구문을 네 칸 들여씁니다.

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 제어 흐름 문

`if` 또는 `when` 문의 조건이 여러 줄인 경우, 항상 문의 본문을 중괄호로 묶습니다.
조건의 각 다음 줄은 문의 시작 부분에 비해 네 칸 들여씁니다.
조건의 닫는 괄호를 여는 중괄호와 함께 별도의 줄에 배치합니다.

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

이는 조건과 문 본문을 정렬하는 데 도움이 됩니다. 

`else`, `catch`, `finally` 키워드와 `do-while` 루프의 `while` 키워드는 이전 중괄호와 같은 줄에 배치합니다.

```kotlin
if (condition) {
    // body
} else {
    // else part
}

try {
    // body
} finally {
    // cleanup
}
```

`when` 문에서, 분기가 한 줄보다 길면 인접한 case 블록과 빈 줄로 구분하는 것을 고려합니다.

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

짧은 분기는 조건과 같은 줄에, 중괄호 없이 배치합니다.

```kotlin
when (foo) {
    true -> bar() // good
    false -> { baz() } // bad
}
```

### 메서드 호출

긴 인수 목록에서는 여는 괄호 뒤에 줄 바꿈을 넣습니다. 인수를 네 칸 들여씁니다. 
밀접하게 관련된 여러 인수는 같은 줄에 그룹화합니다.

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

인수 이름과 값을 구분하는 `=` 기호 주위에 공백을 넣습니다.

### 연결된 호출 감싸기(Wrap chained calls)

연결된 호출을 감쌀 때, `.` 문자 또는 `?.` 연산자를 다음 줄에 단일 들여쓰기로 배치합니다.

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

체인의 첫 번째 호출은 일반적으로 그 앞에 줄 바꿈이 있어야 하지만, 코드가 그렇게 하는 것이 더 합리적이라면 생략해도 무방합니다.

### 람다

람다 표현식에서는 중괄호 주위에 공백을 사용해야 하며, 매개변수와 본문을 구분하는 화살표 주위에도 공백을 사용해야 합니다. 호출이 단일 람다를 받는 경우, 가능하면 괄호 바깥으로 전달합니다.

```kotlin
list.filter { it > 10 }
```

람다에 레이블을 할당할 때, 레이블과 여는 중괄호 사이에 공백을 넣지 않습니다.

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

여러 줄 람다에서 매개변수 이름을 선언할 때, 첫 줄에 이름을 배치하고 그 뒤에 화살표와 줄 바꿈을 넣습니다.

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

매개변수 목록이 너무 길어 한 줄에 맞지 않으면 화살표를 별도의 줄에 배치합니다.

```kotlin
foo {
    context: Context,
    environment: Env
    ->
    context.configureEnv(environment)
}
```

### 후행 쉼표 (Trailing commas)

후행 쉼표는 일련의 요소 중 마지막 항목 뒤에 오는 쉼표 기호입니다.

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

후행 쉼표를 사용하는 것은 몇 가지 이점이 있습니다.

* 버전 관리 diff를 더 깔끔하게 만듭니다 – 변경된 값에 모든 초점이 맞춰집니다.
* 요소를 추가하고 재정렬하기 쉽습니다 – 요소를 조작할 때 쉼표를 추가하거나 삭제할 필요가 없습니다.
* 객체 초기화 등 코드 생성을 단순화합니다. 마지막 요소에도 쉼표가 올 수 있습니다.

후행 쉼표는 전적으로 선택 사항입니다 – 코드는 쉼표 없이도 작동합니다. Kotlin 스타일 가이드는 선언 시 후행 쉼표 사용을 권장하며, 호출 시에는 사용자의 재량에 맡깁니다.

IntelliJ IDEA 포매터에서 후행 쉼표를 활성화하려면 **Settings/Preferences | Editor | Code Style | Kotlin**으로 이동하여 **Other** 탭을 열고 **Use trailing comma** 옵션을 선택합니다.

#### 열거형 (Enumerations) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // trailing comma
}
```

#### 값 인수 (Value arguments) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // trailing comma
)
val colors = listOf(
    "red",
    "green",
    "blue", // trailing comma
)
```

#### 클래스 프로퍼티 및 매개변수 (Class properties and parameters) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Customer(
    val name: String,
    val lastName: String, // trailing comma
)
class Customer(
    val name: String,
    lastName: String, // trailing comma
)
```

#### 함수 값 매개변수 (Function value parameters) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun powerOf(
    number: Int, 
    exponent: Int, // trailing comma
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // trailing comma
) {}
fun print(
    vararg quantity: Int,
    description: String, // trailing comma
) {}
```

#### 선택적 타입 매개변수 (세터 포함) (Parameters with optional type (including setters)) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
val sum: (Int, Int, Int) -> Int = fun(
    x,
    y,
    z, // trailing comma
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### 인덱싱 접미사 (Indexing suffix) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // trailing comma
    ]
```

#### 람다의 매개변수 (Parameters in lambdas) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // trailing comma
        ->
        println("1")
    }
    println(x)
}
```

#### when 엔트리 (when entry) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // trailing comma
        -> true
    else -> false
}
```

#### 컬렉션 리터럴 (어노테이션 내) (Collection literals (in annotations)) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // trailing comma
])
fun run() {}
```

#### 타입 인수 (Type arguments) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // trailing comma
            >()
}
```

#### 타입 매개변수 (Type parameters) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class MyMap<
        MyKey,
        MyValue, // trailing comma
        > {}
```

#### 구조 분해 선언 (Destructuring declarations) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // trailing comma
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // trailing comma
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## 문서 주석

긴 문서 주석의 경우, 여는 `/**`를 별도의 줄에 배치하고 각 다음 줄을 별표로 시작합니다.

```kotlin
/**
 * This is a documentation comment
 * on multiple lines.
 */
```

짧은 주석은 한 줄에 배치할 수 있습니다.

```kotlin
/** This is a short documentation comment. */
```

일반적으로 `@param` 및 `@return` 태그 사용을 피합니다. 대신, 매개변수 및 반환 값에 대한 설명을 문서 주석에 직접 포함하고, 언급된 모든 곳에 매개변수 링크를 추가합니다. `@param` 및 `@return`은 주 텍스트의 흐름에 맞지 않는 긴 설명이 필요한 경우에만 사용합니다.

```kotlin
// Avoid doing this:

/**
 * Returns the absolute value of the given number.
 * @param number The number to return the absolute value for.
 * @return The absolute value.
 */
fun abs(number: Int): Int { /*...*/ }

// Do this instead:

/**
 * Returns the absolute value of the given [number].
 */
fun abs(number: Int): Int { /*...*/ }
```

## 불필요한 구성 피하기

일반적으로 Kotlin에서 특정 구문 구조가 선택 사항이고 IDE에서 불필요하다고 강조 표시되면 코드에서 생략해야 합니다. 단지 "명확성을 위해" 불필요한 구문 요소를 코드에 남겨두지 마십시오.

### Unit 반환 타입

함수가 Unit을 반환하는 경우, 반환 타입은 생략해야 합니다.

```kotlin
fun foo() { // ": Unit" is omitted here

}
```

### 세미콜론

가능한 한 세미콜론을 생략합니다.

### 문자열 템플릿

간단한 변수를 문자열 템플릿에 삽입할 때 중괄호를 사용하지 마십시오. 긴 표현식에만 중괄호를 사용합니다.

```kotlin
println("$name has ${children.size} children")
```

달러 기호 문자를 문자열 리터럴로 처리하려면 [멀티 달러 문자열 보간(multi-dollar string interpolation)](strings.md#multi-dollar-string-interpolation)을 사용하십시오.

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
```

## 언어 기능의 관용적 사용

### 불변성 (Immutability)

변경 가능한 데이터보다 불변 데이터를 사용하는 것을 선호합니다. 초기화 후 수정되지 않는 지역 변수와 프로퍼티는 항상 `var` 대신 `val`로 선언하십시오.

변경되지 않는 컬렉션을 선언할 때는 항상 불변 컬렉션 인터페이스(`Collection`, `List`, `Set`, `Map`)를 사용하십시오. 컬렉션 인스턴스를 생성하기 위해 팩토리 함수를 사용할 때는 가능한 한 불변 컬렉션 타입을 반환하는 함수를 사용하십시오.

```kotlin
// Bad: 변경되지 않을 값에 변경 가능한 컬렉션 타입을 사용
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// Good: 대신 불변 컬렉션 타입을 사용
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// Bad: arrayListOf()는 변경 가능한 컬렉션 타입인 ArrayList<T>를 반환
val allowedValues = arrayListOf("a", "b", "c")

// Good: listOf()는 List<T>를 반환
val allowedValues = listOf("a", "b", "c")
```

### 기본 매개변수 값

오버로드된 함수를 선언하는 것보다 기본 매개변수 값을 가진 함수를 선언하는 것을 선호합니다.

```kotlin
// Bad
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// Good
fun foo(a: String = "a") { /*...*/ }
```

### 타입 별칭 (Type aliases)

코드베이스에서 여러 번 사용되는 함수 타입이나 타입 매개변수가 있는 타입이 있다면, 이를 위한 타입 별칭을 정의하는 것을 선호합니다.

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```
이름 충돌을 피하기 위해 private 또는 internal 타입 별칭을 사용하는 경우, [패키지 및 임포트(Packages and Imports)](packages.md)에 언급된 `import ... as ...`를 선호합니다.

### 람다 매개변수

짧고 중첩되지 않은 람다에서는 매개변수를 명시적으로 선언하는 대신 `it` 컨벤션을 사용하는 것이 좋습니다. 매개변수가 있는 중첩 람다에서는 항상 매개변수를 명시적으로 선언하십시오.

### 람다의 반환

람다에서 여러 레이블이 지정된 반환을 사용하는 것을 피하십시오. 람다의 구조를 재조정하여 단일 종료 지점을 갖도록 고려하십시오.
이것이 불가능하거나 충분히 명확하지 않다면, 람다를 익명 함수로 변환하는 것을 고려하십시오.

람다의 마지막 문장에 레이블이 지정된 반환을 사용하지 마십시오.

### 이름 있는 인수 (Named arguments)

메서드가 동일한 기본 타입의 여러 매개변수나 `Boolean` 타입의 매개변수를 받는 경우, 모든 매개변수의 의미가 문맥상 절대적으로 명확하지 않다면 이름 있는 인수 구문을 사용하십시오.

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 조건문 (Conditional statements)

`try`, `if`, `when`의 표현식 형태를 사용하는 것을 선호합니다.

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 -> "zero"
    else -> "nonzero"
}
```

위의 방식이 다음보다 선호됩니다.

```kotlin
if (x)
    return foo()
else
    return bar()
```

```kotlin
when(x) {
    0 -> return "zero"
    else -> return "nonzero"
}
```

### if 대 when

이항 조건의 경우 `when` 대신 `if`를 사용하는 것을 선호합니다.
예를 들어, `if`와 함께 이 구문을 사용하십시오.

```kotlin
if (x == null) ... else ...
```

`when`과 함께 이 구문 대신:

```kotlin
when (x) {
    null -> // ...
    else -> // ...
}
```

옵션이 세 개 이상인 경우 `when`을 사용하는 것을 선호합니다.

### when 표현식의 가드 조건

[가드 조건(guard conditions)](control-flow.md#guard-conditions-in-when-expressions)이 있는 `when` 표현식 또는 문에서 여러 부울 표현식을 결합할 때는 괄호를 사용하십시오.

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty() || status.info.id == null) -> "no information"
}
```

다음 대신:

```kotlin
when (status) {
    is Status.Ok if status.info.isEmpty() || status.info.id == null -> "no information"
}
```

### 조건문의 널 허용 Boolean 값

조건문에서 널 허용 `Boolean`을 사용해야 하는 경우 `if (value == true)` 또는 `if (value == false)` 검사를 사용하십시오.

### 루프

루프 대신 고차 함수(`filter`, `map` 등)를 사용하는 것을 선호합니다. 예외: `forEach` (수신자가 널 허용이거나 `forEach`가 더 긴 호출 체인의 일부로 사용되는 경우가 아니면 일반 `for` 루프를 사용하는 것을 선호).

여러 고차 함수를 사용하는 복잡한 표현식과 루프 중에서 선택할 때, 각 경우에 수행되는 작업의 비용을 이해하고 성능 고려 사항을 염두에 두십시오.

### 범위에 대한 루프

열린 범위에 대해 루프를 돌려면 `..<` 연산자를 사용하십시오.

```kotlin
for (i in 0..n - 1) { /*...*/ }  // bad
for (i in 0..<n) { /*...*/ }  // good
```

### 문자열

문자열 연결보다 문자열 템플릿을 선호합니다.

일반 문자열 리터럴에 `
` 이스케이프 시퀀스를 포함하는 것보다 여러 줄 문자열을 선호합니다.

여러 줄 문자열에서 들여쓰기를 유지하려면, 결과 문자열에 내부 들여쓰기가 필요하지 않은 경우 `trimIndent`를 사용하거나, 내부 들여쓰기가 필요한 경우 `trimMargin`을 사용하십시오.

```kotlin
fun main() {
//sampleStart
    println("""
     Not
     trimmed
     text
     """
    )

    println("""
     Trimmed
     text
     """.trimIndent()
    )

    println()

    val a = """Trimmed to margin text:
            |if(a > 1) {
            |    return a
            |}""".trimMargin()

   println(a)
//sampleEnd
}
```
{kotlin-runnable="true"}

[Java와 Kotlin의 여러 줄 문자열](java-to-kotlin-idioms-strings.md#use-multiline-strings)의 차이점을 알아보십시오.

### 함수 대 프로퍼티

일부 시나리오에서는 인수가 없는 함수가 읽기 전용 프로퍼티와 상호 교환될 수 있습니다.
의미는 비슷하지만, 어느 것을 선호할지에 대한 몇 가지 스타일 규칙이 있습니다.

다음 경우에 함수보다 프로퍼티를 선호합니다.

* 예외를 발생시키지 않을 때.
* 계산 비용이 저렴할 때 (또는 첫 실행 시 캐시될 때).
* 객체 상태가 변경되지 않은 경우 호출 시 동일한 결과를 반환할 때.

### 확장 함수 (Extension functions)

확장 함수를 자유롭게 사용하십시오. 주로 객체에 대해 작동하는 함수가 있을 때마다 해당 객체를 수신자로 받는 확장 함수로 만드는 것을 고려하십시오. API 오염을 최소화하기 위해, 확장 함수의 가시성을 합리적인 만큼 제한하십시오. 필요에 따라 지역 확장 함수, 멤버 확장 함수 또는 private 가시성을 가진 최상위 확장 함수를 사용하십시오.

### 중위 함수 (Infix functions)

함수가 유사한 역할을 하는 두 객체에 대해 작동할 때만 `infix`로 선언하십시오. 좋은 예: `and`, `to`, `zip`.
나쁜 예: `add`.

수신자 객체를 변경하는 메서드는 `infix`로 선언하지 마십시오.

### 팩토리 함수 (Factory functions)

클래스에 대한 팩토리 함수를 선언하는 경우, 클래스 자체와 동일한 이름을 부여하는 것을 피하십시오. 팩토리 함수의 동작이 특별한 이유를 명확히 하는 별개의 이름을 사용하는 것을 선호합니다. 정말 특별한 의미가 없는 경우에만 클래스와 동일한 이름을 사용할 수 있습니다.

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

다른 슈퍼클래스 생성자를 호출하지 않고 기본값을 가진 매개변수를 포함하는 단일 생성자로 줄일 수 없는 여러 오버로드된 생성자를 가진 객체가 있다면, 오버로드된 생성자를 팩토리 함수로 대체하는 것을 선호합니다.

### 플랫폼 타입 (Platform types)

플랫폼 타입의 표현식을 반환하는 public 함수/메서드는 Kotlin 타입을 명시적으로 선언해야 합니다.

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

플랫폼 타입의 표현식으로 초기화되는 모든 프로퍼티(패키지 레벨 또는 클래스 레벨)는 Kotlin 타입을 명시적으로 선언해야 합니다.

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

플랫폼 타입의 표현식으로 초기화되는 지역 값은 타입 선언을 가질 수도 있고 가지지 않을 수도 있습니다.

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### 스코프 함수(Scope functions) apply/with/run/also/let

Kotlin은 주어진 객체의 컨텍스트에서 코드 블록을 실행하는 일련의 함수를 제공합니다: `let`, `run`, `with`, `apply`, `also`.
자신의 경우에 적절한 스코프 함수를 선택하는 방법에 대한 지침은 [스코프 함수(Scope Functions)](scope-functions.md)를 참조하십시오.

## 라이브러리를 위한 코딩 컨벤션

라이브러리를 작성할 때는 API 안정성을 보장하기 위해 추가적인 규칙을 따르는 것이 좋습니다.

 * 멤버 가시성을 항상 명시적으로 지정하십시오 (실수로 선언을 public API로 노출하는 것을 피하기 위해).
 * 함수 반환 타입과 프로퍼티 타입을 항상 명시적으로 지정하십시오 (구현이 변경될 때 반환 타입이 실수로 변경되는 것을 피하기 위해).
 * 새로운 문서가 필요 없는 오버라이드를 제외하고, 모든 public 멤버에 [KDoc](kotlin-doc.md) 주석을 제공하십시오 (라이브러리 문서 생성을 지원하기 위해).

라이브러리용 API를 작성할 때 고려해야 할 모범 사례 및 아이디어에 대한 자세한 내용은 [라이브러리 작성자 가이드라인(Library authors' guidelines)](api-guidelines-introduction.md)에서 알아보십시오.