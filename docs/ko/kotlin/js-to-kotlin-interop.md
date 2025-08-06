[//]: # (title: JavaScript에서 Kotlin 코드 사용하기)

선택한 [JavaScript 모듈](js-modules.md) 시스템에 따라 Kotlin/JS 컴파일러는 다른 출력을 생성합니다. 하지만 일반적으로 Kotlin 컴파일러는 일반 JavaScript 클래스, 함수 및 속성을 생성하며, 이를 JavaScript 코드에서 자유롭게 사용할 수 있습니다. 단, 몇 가지 세부 사항을 기억해야 합니다.

## plain 모드에서 별도의 JavaScript 객체로 선언 격리

모듈 종류를 명시적으로 `plain`으로 설정한 경우, Kotlin은 현재 모듈의 모든 Kotlin 선언을 포함하는 객체를 생성합니다. 이는 전역 객체를 오염시키는 것을 방지하기 위해 수행됩니다. 즉, `myModule` 모듈의 경우 모든 선언은 `myModule` 객체를 통해 JavaScript에서 사용 가능합니다. 예를 들면 다음과 같습니다:

```kotlin
fun foo() = "Hello"
```

다음과 같이 JavaScript에서 호출할 수 있습니다:

```javascript
alert(myModule.foo());
```

이는 Kotlin 모듈을 UMD(`browser` 및 `nodejs` 타겟의 기본 설정), CommonJS 또는 AMD와 같은 JavaScript 모듈로 컴파일할 경우에는 해당되지 않습니다. 이 경우, 선언은 선택한 JavaScript 모듈 시스템에서 지정한 형식으로 노출됩니다. 예를 들어 UMD 또는 CommonJS를 사용하는 경우, 호출 지점은 다음과 같을 수 있습니다:

```javascript
alert(require('myModule').foo());
```

JavaScript 모듈 시스템에 대한 자세한 내용은 [JavaScript 모듈](js-modules.md) 문서를 확인하세요.

## 패키지 구조

Kotlin은 패키지 구조를 JavaScript에 노출하므로, 선언을 루트 패키지에 정의하지 않는 한 JavaScript에서 정규화된 이름(fully qualified name)을 사용해야 합니다. 예를 들면 다음과 같습니다:

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

예를 들어 UMD 또는 CommonJS를 사용하는 경우, 호출 지점은 다음과 같을 수 있습니다:

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

또는 `plain`을 모듈 시스템 설정으로 사용하는 경우:

```javascript
alert(myModule.my.qualified.packagename.foo());
```

### @JsName 어노테이션

어떤 경우에는 (예: 오버로드 지원을 위해) Kotlin 컴파일러가 JavaScript 코드에서 생성된 함수 및 속성의 이름을 변형합니다(mangling). 생성된 이름을 제어하려면 `@JsName` 어노테이션을 사용할 수 있습니다:

```kotlin
// Module 'kjs'
class Person(val name: String) {
    fun hello() {
        println("Hello $name!")
    }

    @JsName("helloWithGreeting")
    fun hello(greeting: String) {
        println("$greeting $name!")
    }
}
```

이제 다음 방법으로 JavaScript에서 이 클래스를 사용할 수 있습니다:

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

`@JsName` 어노테이션을 지정하지 않았다면, 해당 함수의 이름에는 함수 시그니처에서 계산된 접미사가 포함되었을 것입니다. 예를 들어 `hello_61zpoe`와 같이 됩니다.

Kotlin 컴파일러가 이름 변형(mangling)을 적용하지 않는 경우가 있습니다:
- `external` 선언은 변형되지 않습니다.
- `external`이 아닌 클래스에서 `external` 클래스를 상속받는 오버라이드된 함수는 변형되지 않습니다.

`@JsName`의 매개변수는 유효한 식별자(identifier)인 상수 문자열 리터럴이어야 합니다. 컴파일러는 `@JsName`에 식별자가 아닌 문자열을 전달하려고 시도할 경우 오류를 보고합니다. 다음 예제는 컴파일 타임 오류를 발생시킵니다:

```kotlin
@JsName("new C()")   // error here
external fun newC()
```

### @JsExport 어노테이션

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다.
> 향후 버전에서 디자인이 변경될 수 있습니다.
>
{style="warning"}

`@JsExport` 어노테이션을 최상위 선언(예: 클래스 또는 함수)에 적용하면 Kotlin 선언을 JavaScript에서 사용할 수 있게 됩니다. 이 어노테이션은 Kotlin에서 주어진 이름으로 모든 중첩 선언을 내보냅니다. `@file:JsExport`를 사용하여 파일 수준에서도 적용할 수 있습니다.

내보내기 시 모호성을 해결하려면 (예: 같은 이름을 가진 함수의 오버로드) `@JsExport` 어노테이션을 `@JsName`과 함께 사용하여 생성되고 내보내진 함수의 이름을 지정할 수 있습니다.

현재 [IR 컴파일러 백엔드](js-ir-compiler.md)에서는 `@JsExport` 어노테이션이 함수를 Kotlin에서 볼 수 있도록 하는 유일한 방법입니다.

멀티플랫폼 프로젝트의 경우, `@JsExport`는 공통 코드에서도 사용할 수 있습니다. 이는 JavaScript 타겟으로 컴파일할 때만 효과가 있으며, 플랫폼에 특화되지 않은 Kotlin 선언도 내보낼 수 있도록 합니다.

### @JsStatic

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

`@JsStatic` 어노테이션은 컴파일러에게 대상 선언에 대한 추가 정적 메서드를 생성하도록 지시합니다. 이를 통해 Kotlin 코드의 정적 멤버를 JavaScript에서 직접 사용할 수 있습니다.

`@JsStatic` 어노테이션은 명명된 객체(named objects)에 정의된 함수와 클래스 및 인터페이스 내부에 선언된 컴패니언 객체(companion objects)에 적용할 수 있습니다. 이 어노테이션을 사용하면 컴파일러는 객체의 정적 메서드와 객체 자체의 인스턴스 메서드를 모두 생성합니다. 예를 들면 다음과 같습니다:

```kotlin
// Kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

이제 `callStatic()` 함수는 JavaScript에서 정적이지만 `callNonStatic()` 함수는 그렇지 않습니다:

```javascript
// JavaScript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

`@JsStatic` 어노테이션은 객체 또는 컴패니언 객체의 속성에도 적용할 수 있으며, 해당 객체 또는 컴패니언 객체를 포함하는 클래스에서 해당 속성의 getter 및 setter 메서드를 정적 멤버로 만듭니다.

## JavaScript의 Kotlin 타입

Kotlin 타입이 JavaScript 타입에 어떻게 매핑되는지 확인하세요.

| Kotlin                                                           | JavaScript                | 설명                                                                                   |
|------------------------------------------------------------------|---------------------------|--------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                        | `Number`                  |                                                                                            |
| `Char`                                                           | `Number`                  | 숫자는 문자의 코드를 나타냅니다.                                                          |
| `Long`                                                           | Not supported             | JavaScript에는 64비트 정수 타입이 없으므로 Kotlin 클래스로 에뮬레이션됩니다.                |
| `Boolean`                                                        | `Boolean`                 |                                                                                            |
| `String`                                                         | `String`                  |                                                                                            |
| `Array`                                                          | `Array`                   |                                                                                            |
| `ByteArray`                                                      | `Int8Array`               |                                                                                            |
| `ShortArray`                                                     | `Int16Array`              |                                                                                            |
| `IntArray`                                                       | `Int32Array`              |                                                                                            |
| `CharArray`                                                      | `UInt16Array`             | `'$type$ == "CharArray"` 속성을 가집니다.                                                 |
| `FloatArray`                                                     | `Float32Array`            |                                                                                            |
| `DoubleArray`                                                    | `Float64Array`            |                                                                                            |
| `LongArray`                                                      | `Array<kotlin.Long>`      | `'$type$ == "LongArray"` 속성을 가집니다. Kotlin의 Long 타입 설명도 참조하세요.             |
| `BooleanArray`                                                   | `Int8Array`               | `'$type$ == "BooleanArray"` 속성을 가집니다.                                              |
| `List`, `MutableList`                                            | `KtList`, `KtMutableList` | `KtList.asJsReadonlyArrayView` 또는 `KtMutableList.asJsArrayView`를 통해 `Array`를 노출합니다. |
| `Map`, `MutableMap`                                              | `KtMap`, `KtMutableMap`   | `KtMap.asJsReadonlyMapView` 또는 `KtMutableMap.asJsMapView`를 통해 ES2015 `Map`을 노출합니다. |
| `Set`, `MutableSet`                                              | `KtSet`, `KtMutableSet`   | `KtSet.asJsReadonlySetView` 또는 `KtMutableSet.asJsSetView`를 통해 ES2015 `Set`을 노출합니다. |
| `Unit`                                                           | Undefined                 | 반환 타입으로 사용될 때는 내보낼 수 있지만, 매개변수 타입으로 사용될 때는 그렇지 않습니다.  |
| `Any`                                                            | `Object`                  |                                                                                            |
| `Throwable`                                                      | `Error`                   |                                                                                            |
| `enum class Type`                                                | `Type`                    | Enum 엔트리는 정적 클래스 속성(`Type.ENTRY`)으로 노출됩니다.                              |
| Nullable `Type?`                                                 | `Type | null | undefined` |                                                                                            |
| `@JsExport`로 표시된 타입을 제외한 다른 모든 Kotlin 타입         | Not supported             | Kotlin의 [부호 없는 정수 타입](unsigned-integer-types.md)을 포함합니다.                   |

또한 다음 사항을 아는 것이 중요합니다:

*   Kotlin은 `kotlin.Int`, `kotlin.Byte`, `kotlin.Short`, `kotlin.Char`, `kotlin.Long`에 대한 오버플로우 시맨틱을 유지합니다.
*   Kotlin은 런타임에 숫자 타입을 구별할 수 없으므로 (`kotlin.Long` 제외) 다음 코드는 작동합니다:

    ```kotlin
    fun f() {
        val x: Int = 23
        val y: Any = x
        println(y as Float)
    }
    ```

*   Kotlin은 JavaScript에서 지연 객체 초기화를 유지합니다.
*   Kotlin은 JavaScript에서 최상위 속성의 지연 초기화를 구현하지 않습니다.