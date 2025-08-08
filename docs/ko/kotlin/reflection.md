[//]: # (title: 리플렉션)

_리플렉션(Reflection)_은 런타임에 프로그램의 구조를 분석할 수 있게 해주는 언어 및 라이브러리 기능 모음입니다. 함수와 프로퍼티는 코틀린에서 일급 객체이며, 이를 분석하는 기능(예를 들어, 런타임에 프로퍼티나 함수의 이름 또는 타입을 알아내는 것)은 함수형 또는 반응형 스타일을 사용할 때 필수적입니다.

> Kotlin/JS는 리플렉션 기능에 대한 제한적인 지원을 제공합니다. [Kotlin/JS의 리플렉션에 대해 자세히 알아보세요](js-reflection.md).
>
{style="note"}

## JVM 종속성

JVM 플랫폼에서 코틀린 컴파일러 배포판은 리플렉션 기능을 사용하는 데 필요한 런타임 컴포넌트를 별도의 아티팩트인 `kotlin-reflect.jar`로 포함합니다. 이는 리플렉션 기능을 사용하지 않는 애플리케이션의 런타임 라이브러리 필수 크기를 줄이기 위함입니다.

Gradle 또는 Maven 프로젝트에서 리플렉션을 사용하려면 `kotlin-reflect`에 대한 종속성을 추가하세요:

*   Gradle에서:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation(kotlin("reflect"))
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    dependencies {
        implementation "org.jetbrains.kotlin:kotlin-reflect:%kotlinVersion%"
    }
    ```

    </tab>
    </tabs>

*   Maven에서:
    
    ```xml
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-reflect</artifactId>
        </dependency>
    </dependencies>
    ```

Gradle 또는 Maven을 사용하지 않는 경우, 프로젝트의 클래스패스에 `kotlin-reflect.jar`가 있는지 확인하세요. 그 외 지원되는 경우(명령줄 컴파일러 또는 Ant를 사용하는 IntelliJ IDEA 프로젝트)에는 기본적으로 추가됩니다. 명령줄 컴파일러 및 Ant에서는 `-no-reflect` 컴파일러 옵션을 사용하여 클래스패스에서 `kotlin-reflect.jar`를 제외할 수 있습니다.

## 클래스 참조

가장 기본적인 리플렉션 기능은 코틀린 클래스에 대한 런타임 참조를 얻는 것입니다. 정적으로 알려진 코틀린 클래스에 대한 참조를 얻으려면 _클래스 리터럴_ 구문을 사용할 수 있습니다:

```kotlin
val c = MyClass::class
```

이 참조는 `KClass` 타입 값입니다.

>JVM에서: 코틀린 클래스 참조는 자바 클래스 참조와 동일하지 않습니다. 자바 클래스 참조를 얻으려면 `KClass` 인스턴스에서 `.java` 프로퍼티를 사용하세요.
>
{style="note"}

### 바인딩된 클래스 참조

`::class` 구문을 동일하게 사용하여 객체를 리시버로 사용함으로써 특정 객체의 클래스에 대한 참조를 얻을 수 있습니다:

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

리시버 표현식의 타입(`Widget`)에 관계없이, `GoodWidget` 또는 `BadWidget`과 같은 객체의 정확한 클래스에 대한 참조를 얻습니다.

## 호출 가능한 참조

함수, 프로퍼티, 생성자에 대한 참조는 [함수 타입](lambdas.md#function-types)의 인스턴스로 호출하거나 사용할 수도 있습니다.

모든 호출 가능한 참조에 대한 공통 슈퍼타입은 [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html)이며, 여기서 `R`은 반환 값 타입입니다. 이는 프로퍼티의 프로퍼티 타입이며, 생성자가 반환하는 타입입니다.

### 함수 참조

아래와 같이 선언된 이름 있는 함수가 있는 경우, 직접 호출할 수 있습니다(`isOdd(5)`):

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

또는 함수를 함수 타입 값으로 사용할 수 있습니다. 즉, 다른 함수에 전달할 수 있습니다. 그렇게 하려면 `::` 연산자를 사용하세요:

```kotlin
fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

여기서 `::isOdd`는 `(Int) -> Boolean` 함수 타입의 값입니다.

함수 참조는 매개변수 개수에 따라 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 서브타입 중 하나에 속합니다. 예를 들어, `KFunction3<T1, T2, T3, R>`입니다.

`::`는 예상 타입이 컨텍스트에서 알려진 경우 오버로드된 함수와 함께 사용될 수 있습니다. 예를 들어:

```kotlin
fun main() {
//sampleStart
    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또는 명시적으로 지정된 타입을 가진 변수에 메서드 참조를 저장하여 필요한 컨텍스트를 제공할 수 있습니다:

```kotlin
val predicate: (String) -> Boolean = ::isOdd   // refers to isOdd(x: String)
```

클래스의 멤버나 확장 함수를 사용해야 하는 경우, 한정자를 붙여야 합니다: `String::toCharArray`.

확장 함수에 대한 참조로 변수를 초기화하더라도, 추론된 함수 타입은 리시버가 없지만, 리시버 객체를 받는 추가 매개변수를 갖게 됩니다. 대신 리시버가 있는 함수 타입을 가지려면, 타입을 명시적으로 지정하세요:

```kotlin
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty
```

#### 예시: 함수 합성

다음 함수를 고려해 보세요:

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

이 함수는 전달된 두 함수의 합성을 반환합니다: `compose(f, g) = f(g(*))`. 이 함수를 호출 가능한 참조에 적용할 수 있습니다:

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}

fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    fun length(s: String) = s.length
    
    val oddLength = compose(::isOdd, ::length)
    val strings = listOf("a", "ab", "abc")
    
    println(strings.filter(oddLength))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 프로퍼티 참조

코틀린에서 프로퍼티를 일급 객체로 접근하려면 `::` 연산자를 사용하세요:

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

`::x` 표현식은 `KProperty0<Int>` 타입의 프로퍼티 객체로 평가됩니다. `get()`을 사용하여 값을 읽거나 `name` 프로퍼티를 사용하여 프로퍼티 이름을 검색할 수 있습니다. 자세한 내용은 [`KProperty` 클래스 문서](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)를 참조하세요.

`var y = 1`과 같은 가변 프로퍼티의 경우, `::y`는 `set()` 메서드를 가진 [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 타입의 값을 반환합니다:

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

단일 제네릭 매개변수를 가진 함수가 예상되는 곳에서 프로퍼티 참조를 사용할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

클래스의 멤버인 프로퍼티에 접근하려면 다음과 같이 한정자를 붙이세요:

```kotlin
fun main() {
//sampleStart
    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

확장 프로퍼티의 경우:

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 자바 리플렉션과의 상호 운용성

JVM 플랫폼에서 표준 라이브러리에는 자바 리플렉션 객체와의 매핑을 제공하는 리플렉션 클래스용 확장 기능이 포함되어 있습니다(`kotlin.reflect.jvm` 패키지 참조). 예를 들어, 백킹 필드나 코틀린 프로퍼티의 게터 역할을 하는 자바 메서드를 찾으려면 다음과 같이 작성할 수 있습니다:

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

자바 클래스에 해당하는 코틀린 클래스를 얻으려면 `.kotlin` 확장 프로퍼티를 사용하세요:

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### 생성자 참조

생성자는 메서드 및 프로퍼티와 마찬가지로 참조될 수 있습니다. 프로그램이 생성자와 동일한 매개변수를 취하고 적절한 타입의 객체를 반환하는 함수 타입 객체를 예상하는 모든 곳에서 사용할 수 있습니다. 생성자는 `::` 연산자를 사용하고 클래스 이름을 추가하여 참조됩니다. 매개변수가 없고 반환 타입이 `Foo`인 함수 매개변수를 예상하는 다음 함수를 고려해 보세요:

```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

`::Foo` (클래스 `Foo`의 인자 없는 생성자)를 사용하여 다음과 같이 호출할 수 있습니다:

```kotlin
function(::Foo)
```

생성자에 대한 호출 가능한 참조는 매개변수 개수에 따라 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 서브타입 중 하나로 타입이 지정됩니다.

### 바인딩된 함수 및 프로퍼티 참조

특정 객체의 인스턴스 메서드를 참조할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

예제는 `matches` 메서드를 직접 호출하는 대신 해당 참조를 사용합니다. 이러한 참조는 해당 리시버에 바인딩됩니다. 직접 호출(위 예제처럼)하거나 함수 타입 표현식이 예상되는 모든 곳에서 사용할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

바인딩된 참조와 바인딩되지 않은 참조의 타입을 비교하세요. 바인딩된 호출 가능한 참조는 리시버가 "연결"되어 있으므로, 리시버의 타입이 더 이상 매개변수가 아닙니다:

```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

프로퍼티 참조도 바인딩될 수 있습니다:

```kotlin
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

리시버로 `this`를 명시할 필요가 없습니다: `this::foo`와 `::foo`는 동일합니다.

### 바인딩된 생성자 참조

[이너 클래스](nested-classes.md#inner-classes) 생성자에 대한 바인딩된 호출 가능한 참조는 외부 클래스의 인스턴스를 제공하여 얻을 수 있습니다:

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner