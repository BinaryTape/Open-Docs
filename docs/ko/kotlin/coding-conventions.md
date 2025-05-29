[//]: # (title: 코딩 컨벤션)

널리 알려져 있고 따르기 쉬운 코딩 컨벤션은 모든 프로그래밍 언어에 매우 중요합니다.
여기서는 Kotlin을 사용하는 프로젝트의 코드 스타일과 코드 구성에 대한 가이드라인을 제공합니다.

## IDE에서 스타일 설정

Kotlin을 위한 가장 인기 있는 두 IDE인 [IntelliJ IDEA](https://www.jetbrains.com/idea/)와 [Android Studio](https://developer.android.com/studio/)는
코드 스타일링을 위한 강력한 지원을 제공합니다. 주어진 코드 스타일에 맞춰 코드를 자동으로 포맷하도록 설정할 수 있습니다.

### 스타일 가이드 적용

1. **설정/환경설정(Settings/Preferences) | 에디터(Editor) | 코드 스타일(Code Style) | Kotlin**으로 이동합니다.
2. **...에서 설정(Set from...)**을 클릭합니다.
3. **Kotlin 스타일 가이드(Kotlin style guide)**를 선택합니다.

### 코드가 스타일 가이드를 따르는지 확인

1. **설정/환경설정(Settings/Preferences) | 에디터(Editor) | 검사(Inspections) | 일반(General)**으로 이동합니다.
2. **잘못된 포맷팅(Incorrect formatting)** 검사를 활성화합니다.
스타일 가이드에 설명된 다른 문제(예: 이름 지정 규칙)를 확인하는 추가 검사는 기본적으로 활성화되어 있습니다.

## 소스 코드 구성

### 디렉토리 구조

순수 Kotlin 프로젝트에서 권장되는 디렉토리 구조는 공통 루트 패키지가 생략된 패키지 구조를 따릅니다.
예를 들어, 프로젝트의 모든 코드가 `org.example.kotlin` 패키지 및 그 하위 패키지에 있는 경우, `org.example.kotlin` 패키지가 있는 파일은 소스 루트 바로 아래에 위치해야 하며, `org.example.kotlin.network.socket`에 있는 파일은 소스 루트의 `network/socket` 하위 디렉토리에 있어야 합니다.

>JVM 환경: Kotlin이 Java와 함께 사용되는 프로젝트에서는 Kotlin 소스 파일이 Java 소스 파일과 동일한
>소스 루트에 있어야 하며 동일한 디렉토리 구조를 따라야 합니다: 각 파일은 각 패키지 선언문에 해당하는
>디렉토리에 저장되어야 합니다.
>
{style="note"}

### 소스 파일 이름

Kotlin 파일에 단일 클래스 또는 인터페이스(관련 최상위 선언이 있을 수 있음)가 포함된 경우, 파일 이름은 클래스 이름과 동일해야 하며 `.kt` 확장자가 추가됩니다. 이는 모든 타입의 클래스와 인터페이스에 적용됩니다.
파일에 여러 클래스 또는 최상위 선언만 포함된 경우, 파일의 내용을 설명하는 이름을 선택하고 그에 따라 파일 이름을 지정합니다.
각 단어의 첫 글자를 대문자로 시작하는 [파스칼 케이스(PascalCase)](https://ko.wikipedia.org/wiki/파스칼_케이스)를 사용합니다.
예: `ProcessDeclarations.kt`.

파일 이름은 파일 내 코드의 기능을 설명해야 합니다. 따라서 파일 이름에 `Util`과 같이 의미 없는 단어를 사용하지 않아야 합니다.

#### 멀티플랫폼 프로젝트

멀티플랫폼 프로젝트에서 플랫폼별 소스 세트의 최상위 선언이 있는 파일에는 해당 소스 세트의 이름과 관련된 접미사가 있어야 합니다. 예:

* **jvm**Main/kotlin/Platform.**jvm**.kt
* **android**Main/kotlin/Platform.**android**.kt
* **ios**Main/kotlin/Platform.**ios**.kt

공통 소스 세트의 경우, 최상위 선언이 있는 파일에는 접미사가 없어야 합니다. 예: `commonMain/kotlin/Platform.kt`.

##### 기술적 세부 정보 {initial-collapse-state="collapsed" collapsible="true"}

멀티플랫폼 프로젝트에서 이 파일 이름 지정 방식을 따르는 것을 권장하는 이유는 JVM 제약 사항 때문입니다: JVM은 최상위 멤버(함수, 프로퍼티)를 허용하지 않습니다.

이 문제를 해결하기 위해 Kotlin JVM 컴파일러는 최상위 멤버 선언을 포함하는 래퍼 클래스(wrapper class)(소위 "파일 퍼사드(file facade)")를 생성합니다. 파일 퍼사드는 파일 이름에서 파생된 내부 이름을 갖습니다.

결과적으로 JVM은 동일한 정규화된 전체 이름(FQN, Fully Qualified Name)을 가진 여러 클래스를 허용하지 않습니다. 이로 인해 Kotlin 프로젝트가 JVM으로 컴파일되지 못하는 상황이 발생할 수 있습니다:

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // 'fun count() { }' 포함
|- jvmMain/kotlin/myPackage/Platform.kt // 'fun multiply() { }' 포함
```

여기서 두 `Platform.kt` 파일은 동일한 패키지에 있으므로 Kotlin JVM 컴파일러는 두 개의 파일 퍼사드를 생성하며, 둘 다 `myPackage.PlatformKt`라는 FQN을 갖게 됩니다. 이로 인해 "Duplicate JVM classes" 오류가 발생합니다.

이를 피하는 가장 간단한 방법은 위 가이드라인에 따라 파일 중 하나의 이름을 변경하는 것입니다. 이 이름 지정 방식은 코드 가독성을 유지하면서 충돌을 피하는 데 도움이 됩니다.

> 이러한 권장 사항이 불필요해 보일 수 있는 두 가지 시나리오가 있지만, 그럼에도 불구하고 따르는 것이 좋습니다:
>
> * 비 JVM 플랫폼에서는 파일 퍼사드 중복 문제가 발생하지 않습니다. 그러나 이 이름 지정 방식은 파일 이름의 일관성을 유지하는 데 도움이 될 수 있습니다.
> * JVM에서 소스 파일에 최상위 선언이 없는 경우 파일 퍼사드가 생성되지 않으므로 이름 충돌이 발생하지 않습니다.
>
>   그러나 이 이름 지정 방식은 간단한 리팩터링(refactoring)이나 추가 작업으로 인해 최상위 함수가 포함되어 동일한 "Duplicate JVM classes" 오류가 발생하는 상황을 피하는 데 도움이 될 수 있습니다.
>
{style="tip"}

### 소스 파일 구성

여러 선언(클래스, 최상위 함수 또는 프로퍼티)을 동일한 Kotlin 소스 파일에 배치하는 것은 이러한 선언이 의미론적으로 서로 밀접하게 관련되어 있고 파일 크기가 적절한 수준(수백 줄을 초과하지 않음)으로 유지되는 한 권장됩니다.

특히, 클래스의 모든 클라이언트에 관련된 확장 함수를 정의할 때는 클래스 자체와 동일한 파일에 배치합니다. 특정 클라이언트에만 의미가 있는 확장 함수를 정의할 때는 해당 클라이언트의 코드 옆에 배치합니다. 어떤 클래스의 모든 확장을 담기 위해 파일을 만드는 것을 피하십시오.

### 클래스 레이아웃

클래스의 내용은 다음 순서로 배치해야 합니다:

1. 프로퍼티 선언 및 초기화 블록
2. 보조 생성자
3. 메서드 선언
4. 동반 객체

메서드 선언을 알파벳순이나 가시성으로 정렬하거나 일반 메서드와 확장 메서드를 분리하지 마십시오. 대신 관련된 것들을 함께 배치하여 클래스를 위에서 아래로 읽는 사람이 진행 상황의 논리를 따라갈 수 있도록 하십시오. 순서(상위 수준 항목을 먼저 배치하거나 그 반대로)를 선택하고 이를 일관되게 유지하십시오.

중첩 클래스는 해당 클래스를 사용하는 코드 옆에 배치합니다. 클래스가 외부에서 사용될 예정이고 클래스 내부에서 참조되지 않는 경우, 동반 객체 뒤의 끝에 배치합니다.

### 인터페이스 구현 레이아웃

인터페이스를 구현할 때, 구현 멤버를 인터페이스 멤버와 동일한 순서로 유지합니다 (필요한 경우 구현에 사용되는 추가 private 메서드를 사이사이에 배치).

### 오버로드 레이아웃

클래스 내에서 오버로드는 항상 서로 옆에 배치합니다.

## 이름 지정 규칙

Kotlin의 패키지 및 클래스 이름 지정 규칙은 매우 간단합니다:

* 패키지 이름은 항상 소문자이며 밑줄을 사용하지 않습니다 (`org.example.project`). 여러 단어로 된 이름을 사용하는 것은 일반적으로 권장되지 않지만, 여러 단어를 사용해야 하는 경우 단어들을 그냥 이어 붙이거나 카멜 케이스(camelCase) (`org.example.myProject`)를 사용할 수 있습니다.

* 클래스와 객체의 이름은 파스칼 케이스(PascalCase)를 사용합니다:

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 함수 이름

함수, 프로퍼티 및 지역 변수의 이름은 소문자로 시작하고 밑줄 없이 카멜 케이스(camelCase)를 사용합니다:

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

예외: 클래스의 인스턴스를 생성하는 데 사용되는 팩토리 함수는 추상 반환 타입과 동일한 이름을 가질 수 있습니다:

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### 테스트 메서드 이름

테스트에서(그리고 **오직** 테스트에서만), 백틱(`)으로 묶인 공백이 포함된 메서드 이름을 사용할 수 있습니다.
이러한 메서드 이름은 API 레벨 30부터 Android 런타임에서만 지원됩니다. 테스트 코드에서는 메서드 이름에 밑줄을 사용하는 것도 허용됩니다.

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }

     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 프로퍼티 이름

상수( `const`로 표시된 프로퍼티, 또는 사용자 정의 `get` 함수가 없고 깊은 불변 데이터를 보유하는 최상위 또는 객체 `val` 프로퍼티)의 이름은 [스크리밍 스네이크 케이스(SCREAMING_SNAKE_CASE)](https://ko.wikipedia.org/wiki/스네이크_케이스) 규칙에 따라 모두 대문자로 밑줄로 구분된 이름을 사용해야 합니다:

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

동작이나 가변 데이터를 보유하는 객체를 가진 최상위 또는 객체 프로퍼티의 이름은 카멜 케이스(camelCase) 이름을 사용해야 합니다:

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

싱글턴 객체에 대한 참조를 보유하는 프로퍼티의 이름은 `object` 선언과 동일한 명명 스타일을 사용할 수 있습니다:

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

enum 상수의 경우, 사용 방식에 따라 모두 대문자로 밑줄로 구분된 ([스크리밍 스네이크 케이스(SCREAMING_SNAKE_CASE)](https://ko.wikipedia.org/wiki/스네이크_케이스)) 이름(`enum class Color { RED, GREEN }`) 또는 파스칼 케이스(PascalCase) 이름을 사용하는 것이 좋습니다.

### 지원 프로퍼티(backing property) 이름

클래스에 개념적으로는 동일하지만 하나는 공개 API의 일부이고 다른 하나는 구현 세부사항인 두 개의 프로퍼티가 있는 경우, private 프로퍼티 이름의 접두사로 밑줄을 사용합니다:

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 좋은 이름 선택하기

클래스 이름은 일반적으로 클래스가 무엇인지 설명하는 명사 또는 명사구입니다: `List`, `PersonReader`.

메서드 이름은 일반적으로 메서드가 무엇을 하는지 설명하는 동사 또는 동사구입니다: `close`, `readPersons`.
이름은 또한 메서드가 객체를 변경하는지 아니면 새 객체를 반환하는지를 암시해야 합니다. 예를 들어 `sort`는 컬렉션을 제자리에서 정렬하는 반면, `sorted`는 정렬된 컬렉션의 복사본을 반환합니다.

이름은 해당 요소의 목적을 명확하게 나타내야 하므로, 이름에 `Manager`, `Wrapper`와 같이 의미 없는 단어를 사용하지 않는 것이 좋습니다.

선언 이름의 일부로 두문자어(acronym)를 사용하는 경우 다음 규칙을 따릅니다:

* 두 글자 두문자어의 경우 두 글자 모두 대문자로 사용합니다. 예: `IOStream`.
* 두 글자보다 긴 두문자어의 경우 첫 글자만 대문자로 사용합니다. 예: `XmlFormatter` 또는 `HttpInputStream`.

## 포맷팅

### 들여쓰기

들여쓰기에는 4칸 공백을 사용합니다. 탭은 사용하지 마십시오.

중괄호의 경우, 여는 중괄호는 구문이 시작되는 줄의 끝에 배치하고, 닫는 중괄호는 여는 구문과 가로로 정렬된 별도의 줄에 배치합니다.

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

>Kotlin에서는 세미콜론은 선택 사항이므로 줄 바꿈이 중요합니다. 언어 디자인은 Java 스타일 중괄호를 가정하므로 다른 포맷팅 스타일을 사용하려고 하면 예기치 않은 동작이 발생할 수 있습니다.
>
{style="note"}

### 가로 공백

* 이항 연산자(`a + b`) 주변에 공백을 넣습니다. 예외: "범위 지정" 연산자(`0..i`) 주변에는 공백을 넣지 않습니다.
* 단항 연산자(`a++`) 주변에는 공백을 넣지 않습니다.
* 제어 흐름 키워드(`if`, `when`, `for`, `while`)와 해당 여는 괄호 사이에 공백을 넣습니다.
* 주 생성자 선언, 메서드 선언 또는 메서드 호출에서 여는 괄호 앞에 공백을 넣지 않습니다.

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

* `(`, `[` 다음이나 `]`, `)` 앞에는 절대 공백을 넣지 않습니다.
* `.` 또는 `?.` 주변에는 절대 공백을 넣지 않습니다: `foo.bar().filter { it > 2 }.joinToString()`, `foo?.bar()`.
* `//` 다음에 공백을 넣습니다: `// 이것은 주석입니다`.
* 타입 파라미터를 지정하는 데 사용되는 꺾쇠괄호 주변에는 공백을 넣지 않습니다: `class Map<K, V> { ... }`.
* `::` 주변에는 공백을 넣지 않습니다: `Foo::class`, `String::length`.
* nullable 타입을 표시하는 데 사용되는 `?` 앞에는 공백을 넣지 않습니다: `String?`.

일반적으로 어떤 종류의 가로 정렬도 피하십시오. 식별자 이름을 다른 길이의 이름으로 변경해도 선언이나 사용처의 포맷팅에 영향을 주어서는 안 됩니다.

### 콜론

다음 시나리오에서는 `:` 앞에 공백을 넣습니다:

* 타입과 슈퍼타입을 구분하는 데 사용될 때.
* 슈퍼클래스 생성자 또는 동일 클래스의 다른 생성자에 위임할 때.
* `object` 키워드 뒤에.

선언과 해당 타입을 구분하는 `:` 앞에는 공백을 넣지 않습니다.

항상 `:` 뒤에 공백을 넣습니다.

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

주 생성자 파라미터가 몇 개 없는 클래스는 한 줄로 작성할 수 있습니다:

```kotlin
class Person(id: Int, name: String)
```

헤더가 긴 클래스는 각 주 생성자 파라미터가 들여쓰기와 함께 별도의 줄에 있도록 포맷해야 합니다.
또한, 닫는 괄호는 새 줄에 있어야 합니다. 상속을 사용하는 경우, 슈퍼클래스 생성자 호출 또는 구현된 인터페이스 목록은 괄호와 같은 줄에 위치해야 합니다:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

여러 인터페이스의 경우, 슈퍼클래스 생성자 호출이 먼저 위치하고 각 인터페이스는 다른 줄에 위치해야 합니다:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

슈퍼타입 목록이 긴 클래스의 경우, 콜론 뒤에 줄 바꿈을 넣고 모든 슈퍼타입 이름을 가로로 정렬합니다:

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

클래스 헤더가 길 때 클래스 헤더와 본문을 명확하게 구분하려면, 클래스 헤더 뒤에 빈 줄을 넣거나(위 예시처럼) 여는 중괄호를 별도의 줄에 배치합니다:

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne
{
    fun foo() { /*...*/ }
}
```

생성자 파라미터에는 일반 들여쓰기(4칸 공백)를 사용합니다. 이렇게 하면 주 생성자에 선언된 프로퍼티가 클래스 본문에 선언된 프로퍼티와 동일한 들여쓰기를 갖도록 보장합니다.

### 변경자 순서

선언에 여러 변경자가 있는 경우 항상 다음 순서로 배치합니다:

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
enum / annotation / fun // `fun interface`에서 변경자로 사용될 때
companion
inline / value
infix
operator
data
```

모든 어노테이션은 변경자 앞에 배치합니다:

```kotlin
@Named("Foo")
private val foo: Foo
```

라이브러리 작업을 하는 경우가 아니라면, 불필요한 변경자(예: `public`)는 생략합니다.

### 어노테이션

어노테이션은 부착된 선언 앞의 별도 줄에 동일한 들여쓰기로 배치합니다:

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

파일 어노테이션은 파일 주석(있는 경우) 뒤, `package` 문 앞에 배치되며, `package`와 빈 줄로 구분됩니다 (패키지가 아닌 파일을 대상으로 한다는 사실을 강조하기 위해).

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 함수

함수 시그니처가 한 줄에 맞지 않으면 다음 구문을 사용합니다:

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

함수 파라미터에는 일반 들여쓰기(4칸 공백)를 사용합니다. 이는 생성자 파라미터와의 일관성을 보장하는 데 도움이 됩니다.

본문이 단일 표현식으로 구성된 함수의 경우 표현식 본문을 사용하는 것을 선호합니다.

```kotlin
fun foo(): Int {     // 나쁨
    return 1
}

fun foo() = 1        // 좋음
```

### 표현식 본문

함수의 표현식 본문의 첫 줄이 선언과 같은 줄에 맞지 않으면, `=` 기호를 첫 줄에 두고 표현식 본문을 4칸 공백으로 들여씁니다.

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 프로퍼티

매우 간단한 읽기 전용 프로퍼티의 경우 한 줄 포맷팅을 고려합니다:

```kotlin
val isEmpty: Boolean get() = size == 0
```

더 복잡한 프로퍼티의 경우 항상 `get` 및 `set` 키워드를 별도 줄에 배치합니다:

```kotlin
val foo: String
    get() { /*...*/ }
```

초기화자가 있는 프로퍼티의 경우, 초기화자가 길면 `=` 기호 뒤에 줄 바꿈을 추가하고 초기화자를 4칸 공백으로 들여씁니다:

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 제어 흐름문

`if` 또는 `when` 문의 조건이 여러 줄인 경우, 항상 문 본문 주위에 중괄호를 사용합니다.
조건의 각 다음 줄은 문 시작을 기준으로 4칸 공백으로 들여씁니다.
조건의 닫는 괄호는 여는 중괄호와 함께 별도의 줄에 배치합니다:

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

이렇게 하면 조건과 문 본문을 정렬하는 데 도움이 됩니다.

`else`, `catch`, `finally` 키워드 및 `do-while` 루프의 `while` 키워드는 앞선 중괄호와 같은 줄에 배치합니다:

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

`when` 문에서 분기가 한 줄 이상인 경우, 인접한 case 블록과 빈 줄로 구분하는 것을 고려하십시오:

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

짧은 분기는 조건과 같은 줄에 중괄호 없이 배치합니다.

```kotlin
when (foo) {
    true -> bar() // 좋음
    false -> { baz() } // 나쁨
}
```

### 메서드 호출

긴 인수 목록에서는 여는 괄호 뒤에 줄 바꿈을 넣습니다. 인수를 4칸 공백으로 들여씁니다.
밀접하게 관련된 여러 인수를 같은 줄에 그룹화합니다.

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

인수 이름과 값을 구분하는 `=` 기호 주변에 공백을 넣습니다.

### 연쇄 호출 줄 바꿈

연쇄 호출을 줄 바꿈할 때, `.` 문자 또는 `?.` 연산자를 다음 줄에 단일 들여쓰기로 배치합니다:

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

체인의 첫 번째 호출은 일반적으로 그 앞에 줄 바꿈이 있어야 하지만, 코드가 그런 식으로 더 의미가 통한다면 생략해도 괜찮습니다.

### 람다

람다 표현식에서는 중괄호 주변과 파라미터를 본문과 구분하는 화살표 주변에 공백을 사용해야 합니다. 호출이 단일 람다를 사용하는 경우 가능하면 괄호 밖에 전달합니다.

```kotlin
list.filter { it > 10 }
```

람다에 레이블을 할당하는 경우, 레이블과 여는 중괄호 사이에 공백을 넣지 마십시오:

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

여러 줄 람다에서 파라미터 이름을 선언할 때, 이름을 첫 줄에 배치하고 화살표와 줄 바꿈을 그 뒤에 둡니다:

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

파라미터 목록이 너무 길어 한 줄에 맞지 않으면 화살표를 별도 줄에 배치합니다:

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

### 후행 쉼표(trailing comma)

후행 쉼표는 일련의 요소 중 마지막 항목 뒤에 오는 쉼표 기호입니다:

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // 후행 쉼표
)
```

후행 쉼표를 사용하면 다음과 같은 여러 이점이 있습니다:

* 버전 관리 diff가 더 깔끔해집니다 – 변경된 값에만 초점이 맞춰지기 때문입니다.
* 요소를 쉽게 추가하고 재정렬할 수 있습니다 – 요소를 조작할 때 쉼표를 추가하거나 삭제할 필요가 없습니다.
* 예를 들어 객체 초기화자와 같은 코드 생성을 단순화합니다. 마지막 요소에도 쉼표를 사용할 수 있습니다.

후행 쉼표는 전적으로 선택 사항입니다 – 코드는 후행 쉼표 없이도 계속 작동합니다. Kotlin 스타일 가이드는 선언 위치에서 후행 쉼표 사용을 권장하며 호출 위치에서는 사용자의 재량에 맡깁니다.

IntelliJ IDEA 포맷터에서 후행 쉼표를 활성화하려면 **설정/환경설정(Settings/Preferences) | 에디터(Editor) | 코드 스타일(Code Style) | Kotlin**으로 이동하여 **기타(Other)** 탭을 열고 **후행 쉼표 사용(Use trailing comma)** 옵션을 선택합니다.

#### 열거형 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // 후행 쉼표
}
```

#### 값 인수 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // 후행 쉼표
)
val colors = listOf(
    "red",
    "green",
    "blue", // 후행 쉼표
)
```

#### 클래스 프로퍼티 및 파라미터 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Customer(
    val name: String,
    val lastName: String, // 후행 쉼표
)
class Customer(
    val name: String,
    lastName: String, // 후행 쉼표
)
```

#### 함수 값 파라미터 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 후행 쉼표
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // 후행 쉼표
) {}
fun print(
    vararg quantity: Int,
    description: String, // 후행 쉼표
) {}
```

#### 선택적 타입의 파라미터 (setter 포함) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
val sum: (Int, Int, Int) -> Int = fun(
    x,
    y,
    z, // 후행 쉼표
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### 인덱싱 접미사 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // 후행 쉼표
    ]
```

#### 람다의 파라미터 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // 후행 쉼표
        ->
        println("1")
    }
    println(x)
}
```

#### when 항목 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // 후행 쉼표
        -> true
    else -> false
}
```

#### 컬렉션 리터럴 (어노테이션 내) {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // 후행 쉼표
])
fun run() {}
```

#### 타입 인수 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // 후행 쉼표
            >()
}
```

#### 타입 파라미터 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class MyMap<
        MyKey,
        MyValue, // 후행 쉼표
        > {}
```

#### 구조 분해 선언 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // 후행 쉼표
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // 후행 쉼표
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## 문서화 주석

긴 문서화 주석의 경우, 여는 `/**`를 별도의 줄에 배치하고 각 다음 줄을 별표로 시작합니다:

```kotlin
/**
 * 이것은 여러 줄에 걸친
 * 문서화 주석입니다.
 */
```

짧은 주석은 한 줄에 배치할 수 있습니다:

```kotlin
/** 이것은 짧은 문서화 주석입니다. */
```

일반적으로 `@param` 및 `@return` 태그 사용을 피하십시오. 대신 파라미터 및 반환 값에 대한 설명을 문서화 주석에 직접 통합하고, 언급되는 곳마다 파라미터에 대한 링크를 추가하십시오. `@param` 및 `@return`은 본문 흐름에 맞지 않는 긴 설명이 필요한 경우에만 사용하십시오.

```kotlin
// 이렇게 하지 마십시오:

/**
 * 주어진 숫자의 절댓값을 반환합니다.
 * @param number 절댓값을 반환할 숫자.
 * @return 절댓값.
 */
fun abs(number: Int): Int { /*...*/ }

// 대신 이렇게 하십시오:

/**
 * 주어진 [number]의 절댓값을 반환합니다.
 */
fun abs(number: Int): Int { /*...*/ }
```

## 불필요한 구문 피하기

일반적으로 Kotlin의 특정 구문 구조가 선택 사항이고 IDE에서 불필요하다고 강조 표시되는 경우 코드에서 생략해야 합니다. "명확성을 위해" 불필요한 구문 요소를 코드에 남겨두지 마십시오.

### Unit 반환 타입

함수가 Unit을 반환하면 반환 타입을 생략해야 합니다:

```kotlin
fun foo() { // ": Unit"이 여기서 생략됨

}
```

### 세미콜론

가능한 한 세미콜론을 생략합니다.

### 문자열 템플릿

문자열 템플릿에 단순 변수를 삽입할 때 중괄호를 사용하지 마십시오. 더 긴 표현식에만 중괄호를 사용하십시오.

```kotlin
println("$name has ${children.size} children")
```

## 관용적인 언어 기능 사용

### 불변성

가변 데이터보다 불변 데이터를 사용하는 것을 선호합니다. 초기화 후 수정되지 않는 지역 변수와 프로퍼티는 항상 `var` 대신 `val`로 선언하십시오.

변경되지 않는 컬렉션을 선언할 때는 항상 불변 컬렉션 인터페이스(`Collection`, `List`, `Set`, `Map`)를 사용하십시오. 팩토리 함수를 사용하여 컬렉션 인스턴스를 생성할 때는 가능하면 항상 불변 컬렉션 타입을 반환하는 함수를 사용하십시오:

```kotlin
// 나쁨: 변경되지 않을 값에 가변 컬렉션 타입 사용
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// 좋음: 대신 불변 컬렉션 타입 사용
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// 나쁨: arrayListOf()는 가변 컬렉션 타입인 ArrayList<T>를 반환
val allowedValues = arrayListOf("a", "b", "c")

// 좋음: listOf()는 List<T>를 반환
val allowedValues = listOf("a", "b", "c")
```

### 기본 파라미터 값

오버로드된 함수를 선언하는 것보다 기본 파라미터 값을 가진 함수를 선언하는 것을 선호합니다.

```kotlin
// 나쁨
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// 좋음
fun foo(a: String = "a") { /*...*/ }
```

### 타입 별칭(type alias)

코드베이스에서 여러 번 사용되는 함수형 타입이나 타입 파라미터가 있는 타입이 있는 경우, 이에 대한 타입 별칭을 정의하는 것을 선호합니다:

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```
이름 충돌을 피하기 위해 private 또는 internal 타입 별칭을 사용하는 경우, [패키지와 임포트](packages.md)에 언급된 `import ... as ...`를 선호합니다.

### 람다 파라미터

짧고 중첩되지 않은 람다에서는 파라미터를 명시적으로 선언하는 대신 `it` 관용법을 사용하는 것이 좋습니다. 파라미터가 있는 중첩 람다에서는 항상 파라미터를 명시적으로 선언하십시오.

### 람다에서의 반환

람다에서 여러 개의 레이블된 반환문을 사용하는 것을 피하십시오. 람다가 단일 종료 지점을 갖도록 재구성하는 것을 고려하십시오.
이것이 불가능하거나 충분히 명확하지 않은 경우, 람다를 익명 함수로 변환하는 것을 고려하십시오.

람다의 마지막 문장에 레이블된 반환문을 사용하지 마십시오.

### 이름 있는 인수

메서드가 동일한 기본 타입의 여러 파라미터를 사용하거나 `Boolean` 타입의 파라미터를 사용하는 경우, 모든 파라미터의 의미가 문맥상 명확하지 않은 한 이름 있는 인수 구문을 사용합니다.

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 조건문

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

위의 방식이 다음보다 선호됩니다:

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

이항 조건에는 `when` 대신 `if`를 사용하는 것을 선호합니다.
예를 들어, `if`와 함께 이 구문을 사용합니다:

```kotlin
if (x == null) ... else ...
```

`when`을 사용하는 다음 구문 대신:

```kotlin
when (x) {
    null -> // ...
    else -> // ...
}
```

옵션이 세 개 이상인 경우 `when`을 사용하는 것을 선호합니다.

### when 표현식의 가드 조건(guard condition)

[when 표현식의 가드 조건](control-flow.md#guard-conditions-in-when-expressions)을 사용하여 `when` 표현식이나 문에서 여러 부울 표현식을 결합할 때 괄호를 사용합니다:

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

### 조건문에서의 nullable Boolean 값

조건문에서 nullable `Boolean`을 사용해야 하는 경우 `if (value == true)` 또는 `if (value == false)` 검사를 사용합니다.

### 루프

루프보다 고차 함수(`filter`, `map` 등)를 사용하는 것을 선호합니다. 예외: `forEach` (`forEach`의 수신 객체가 nullable이거나 `forEach`가 긴 호출 체인의 일부로 사용되지 않는 한, 일반 `for` 루프를 사용하는 것을 선호합니다).

여러 고차 함수를 사용하는 복잡한 표현식과 루프 사이에서 선택할 때, 각 경우에 수행되는 작업의 비용을 이해하고 성능 고려 사항을 염두에 두십시오.

### 범위에 대한 루프

열린 구간 범위를 반복하려면 `..<` 연산자를 사용합니다:

```kotlin
for (i in 0..n - 1) { /*...*/ }  // 나쁨
for (i in 0..<n) { /*...*/ }  // 좋음
```

### 문자열

문자열 연결보다는 문자열 템플릿을 선호합니다.

일반 문자열 리터럴에 `\n` 이스케이프 시퀀스를 포함하는 것보다 여러 줄 문자열을 선호합니다.

여러 줄 문자열에서 들여쓰기를 유지하려면, 결과 문자열에 내부 들여쓰기가 필요하지 않은 경우 `trimIndent`를 사용하고, 내부 들여쓰기가 필요한 경우 `trimMargin`을 사용합니다:

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

[Java와 Kotlin 여러 줄 문자열](java-to-kotlin-idioms-strings.md#use-multiline-strings)의 차이점을 알아보세요.

### 함수 대 프로퍼티

일부 시나리오에서는 인수가 없는 함수가 읽기 전용 프로퍼티와 서로 바꿔 사용할 수 있습니다.
의미는 비슷하지만, 어떤 것을 선호해야 하는지에 대한 스타일 규칙이 있습니다.

기본 알고리즘이 다음과 같은 경우 함수보다 프로퍼티를 선호합니다:

* 예외를 던지지 않습니다.
* 계산 비용이 저렴합니다 (또는 첫 실행 시 캐시됩니다).
* 객체 상태가 변경되지 않았다면 호출할 때마다 동일한 결과를 반환합니다.

### 확장 함수

확장 함수를 자유롭게 사용하십시오. 주로 객체에 대해 작동하는 함수가 있을 때마다 해당 객체를 수신 객체로 받는 확장 함수로 만드는 것을 고려하십시오. API 오염을 최소화하려면 확장 함수의 가시성을 가능한 한 제한하십시오. 필요한 경우, 지역 확장 함수, 멤버 확장 함수 또는 private 가시성을 가진 최상위 확장 함수를 사용하십시오.

### 중위 함수

두 객체가 비슷한 역할을 하는 경우에만 함수를 `infix` (중위)로 선언하십시오. 좋은 예: `and`, `to`, `zip`.
나쁜 예: `add`.

수신 객체를 변경하는 메서드는 `infix`로 선언하지 마십시오.

### 팩토리 함수

클래스에 대한 팩토리 함수를 선언하는 경우, 클래스 자체와 동일한 이름을 지정하지 마십시오. 팩토리 함수의 동작이 특별한 이유를 명확히 하는 별개의 이름을 사용하는 것을 선호합니다. 정말 특별한 의미 체계가 없는 경우에만 클래스와 동일한 이름을 사용할 수 있습니다.

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

다른 슈퍼클래스 생성자를 호출하지 않고 기본 인수 값으로 단일 생성자로 축소할 수 없는 여러 오버로드된 생성자를 가진 객체가 있는 경우, 오버로드된 생성자를 팩토리 함수로 바꾸는 것을 선호합니다.

### 플랫폼 타입(platform type)

플랫폼 타입의 표현식을 반환하는 공개 함수/메서드는 Kotlin 타입을 명시적으로 선언해야 합니다:

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

플랫폼 타입의 표현식으로 초기화된 모든 프로퍼티(패키지 수준 또는 클래스 수준)는 Kotlin 타입을 명시적으로 선언해야 합니다:

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

플랫폼 타입의 표현식으로 초기화된 지역 값은 타입 선언을 가질 수도 있고 갖지 않을 수도 있습니다:

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### 범위 함수 apply/with/run/also/let

Kotlin은 주어진 객체의 컨텍스트에서 코드 블록을 실행하기 위한 함수 세트(`let`, `run`, `with`, `apply`, `also`)를 제공합니다.
사례에 맞는 올바른 범위 함수를 선택하는 방법에 대한 지침은 [범위 함수](scope-functions.md)를 참조하십시오.

## 라이브러리를 위한 코딩 컨벤션

라이브러리를 작성할 때는 API 안정성을 보장하기 위해 다음과 같은 추가 규칙을 따르는 것이 좋습니다:

 * 항상 멤버 가시성을 명시적으로 지정합니다 (실수로 선언을 공개 API로 노출하는 것을 방지하기 위해).
 * 항상 함수 반환 타입과 프로퍼티 타입을 명시적으로 지정합니다 (구현 변경 시 실수로 반환 타입이 변경되는 것을 방지하기 위해).
 * 모든 공개 멤버에 대해 [KDoc](kotlin-doc.md) 주석을 제공합니다 (라이브러리 문서 생성을 지원하기 위해). 단, 새로운 문서화가 필요 없는 오버라이드는 예외입니다.

라이브러리 API 작성 시 고려해야 할 모범 사례와 아이디어에 대한 자세한 내용은 [라이브러리 작성자 가이드라인](api-guidelines-introduction.md)에서 알아보세요.