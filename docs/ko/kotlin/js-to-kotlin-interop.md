[//]: # (title: JavaScript에서 Kotlin 코드 사용하기)

선택한 [JavaScript 모듈](js-modules.md) 시스템에 따라 Kotlin/JS 컴파일러는 서로 다른 출력을 생성합니다.
하지만 일반적으로 Kotlin 컴파일러는 일반적인 JavaScript 클래스, 함수 및 프로퍼티를 생성하며, 이를 JavaScript 코드에서 자유롭게 사용할 수 있습니다.
다만 기억해야 할 몇 가지 미묘한 사항들이 있습니다.

## plain 모드에서 별도의 JavaScript 객체로 선언 격리하기

모듈 종류를 `plain`으로 명시적으로 설정하면, Kotlin은 현재 모듈의 모든 Kotlin 선언을 포함하는 객체를 생성합니다. 이는 전역 객체가 오염되는 것을 방지하기 위함입니다. 즉, `myModule`이라는 모듈의 경우 모든 선언은 `myModule` 객체를 통해 JavaScript에서 사용할 수 있습니다. 예를 들어:

```kotlin
fun foo() = "Hello"
```

이 함수는 JavaScript에서 다음과 같이 호출할 수 있습니다:

```javascript
alert(myModule.foo());
```

Kotlin 모듈을 [UMD](https://github.com/umdjs/umd) (`browser` 및 `nodejs` 타겟의 기본 설정), [ESM](https://tc39.es/ecma262/#sec-modules), [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules), 또는 [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)와 같은 JavaScript 모듈로 컴파일할 때는 이와 같이 직접 함수를 호출하는 방식이 적용되지 않습니다.
이 경우 선언은 선택한 JavaScript 모듈 시스템에 따라 노출됩니다.
예를 들어 UMD, ESM 또는 CommonJS를 사용하는 경우 호출부는 다음과 같습니다:

```javascript
alert(require('myModule').foo());
```

JavaScript 모듈 시스템에 대한 자세한 내용은 [JavaScript 모듈](js-modules.md)을 참고하세요.

## 패키지 구조

대부분의 모듈 시스템(CommonJS, Plain, UMD)에서 Kotlin은 패키지 구조를 JavaScript에 노출합니다.
루트 패키지에 선언을 정의하지 않는 한, JavaScript에서는 정규화된 이름(fully qualified name)을 사용해야 합니다.
예를 들어:

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

UMD나 CommonJS를 사용하는 경우 호출부는 다음과 같습니다:

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

`plain` 모듈 시스템 설정을 사용하는 경우 호출부는 다음과 같습니다:

```javascript
alert(myModule.my.qualified.packagename.foo());
```

ECMAScript 모듈(ESM)을 타겟으로 할 때는 애플리케이션 번들 크기를 최적화하고 일반적인 ESM 패키지 레이아웃과 일치시키기 위해 패키지 정보가 유지되지 않습니다.
이 경우 ES 모듈에서 Kotlin 선언을 사용하는 모습은 다음과 같습니다:

```javascript
import { foo } from 'myModule';

alert(foo());
```

### @JsName 어노테이션

어떤 경우(예: 오버로드 지원)에는 Kotlin 컴파일러가 JavaScript 코드에서 생성된 함수 및 속성의 이름을 맹글링(mangle)합니다. 생성되는 이름을 제어하려면 `@JsName` 어노테이션을 사용할 수 있습니다:

```kotlin
// 모듈 'kjs'
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

이제 JavaScript에서 다음과 같은 방식으로 이 클래스를 사용할 수 있습니다:

```javascript
// 필요한 경우 선택한 모듈 시스템에 따라 'kjs'를 임포트합니다.
var person = new kjs.Person("Dmitry");   // 'kjs' 모듈을 참조합니다.
person.hello();                          // "Hello Dmitry!"를 출력합니다.
person.helloWithGreeting("Servus");      // "Servus Dmitry!"를 출력합니다.
```

만약 `@JsName` 어노테이션을 지정하지 않았다면, 해당 함수의 이름에는 함수 시그니처에서 계산된 접미사가 포함되었을 것입니다(예: `hello_61zpoe`).

Kotlin 컴파일러가 맹글링을 적용하지 않는 몇 가지 경우가 있습니다:
- `external` 선언은 맹글링되지 않습니다.
- `external` 클래스를 상속받는 비-`external` 클래스 내의 모든 오버라이드된 함수는 맹글링되지 않습니다.

`@JsName`의 매개변수는 유효한 식별자인 상수 문자열 리터럴이어야 합니다.
컴파일러는 식별자가 아닌 문자열을 `@JsName`에 전달하려고 시도할 때 오류를 보고합니다.
다음 예제는 컴파일 타임 오류를 발생시킵니다:

```kotlin
@JsName("new C()")   // 여기서 오류 발생
external fun newC()
```

### @JsExport 어노테이션

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
> 디자인이 향후 버전에서 변경될 수 있습니다.
>
{style="warning"} 

최상위 선언(클래스나 함수 등)에 `@JsExport` 어노테이션을 적용하면 Kotlin 선언을 JavaScript에서 사용할 수 있게 됩니다. 이 어노테이션은 Kotlin에 정의된 이름으로 모든 중첩된 선언을 내보냅니다.
`@file:JsExport`를 사용하여 파일 수준에서 적용할 수도 있습니다.

내보내기 시 모호함(예: 동일한 이름을 가진 함수의 오버로드)을 해결하기 위해 `@JsExport` 어노테이션을 `@JsName`과 함께 사용하여 생성 및 내보낼 함수의 이름을 지정할 수 있습니다.

현재로서는 `@JsExport` 어노테이션이 Kotlin에서 함수를 보이게 만드는 유일한 방법입니다.

멀티플랫폼 프로젝트의 경우, `@JsExport`는 공통(common) 코드에서도 사용할 수 있습니다. 이는 JavaScript 타겟으로 컴파일할 때만 효과가 있으며, 플랫폼에 국한되지 않는 Kotlin 선언도 내보낼 수 있게 해줍니다.

### @JsStatic

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic)에서 이에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

`@JsStatic` 어노테이션은 컴파일러가 대상 선언에 대해 추가적인 정적 메서드를 생성하도록 지시합니다. 이를 통해 Kotlin 코드의 정적 멤버를 JavaScript에서 직접 사용할 수 있습니다.

`@JsStatic` 어노테이션은 이름이 지정된 객체(named objects)에 정의된 함수뿐만 아니라 클래스 및 인터페이스 내부에 선언된 동반 객체(companion objects)에도 적용할 수 있습니다. 이 어노테이션을 사용하면 컴파일러는 객체의 정적 메서드와 객체 자체의 인스턴스 메서드를 모두 생성합니다. 예를 들어:

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

이제 JavaScript에서 `callStatic()` 함수는 정적이지만, `callNonStatic()` 함수는 그렇지 않습니다:

```javascript
// JavaScript
C.callStatic();              // 작동함, 정적 함수에 접근
C.callNonStatic();           // 오류, 생성된 JavaScript에서 정적 함수가 아님
C.Companion.callStatic();    // 인스턴스 메서드는 유지됨
C.Companion.callNonStatic(); // 이 방식만 작동함
```

객체 또는 동반 객체의 프로퍼티에도 `@JsStatic` 어노테이션을 적용할 수 있으며, 이 경우 해당 프로퍼티의 게터(getter)와 세터(setter) 메서드는 해당 객체 또는 동반 객체를 포함하는 클래스의 정적 멤버가 됩니다.

### Kotlin의 `Long` 타입을 표현하기 위해 `BigInt` 타입 사용하기
<primary-label ref="experimental-general"/>

Kotlin/JS는 현대적인 JavaScript(ES2020)로 컴파일할 때 Kotlin `Long` 값을 표현하기 위해 JavaScript의 기본 `BigInt` 타입을 사용합니다.

`BigInt` 타입 지원을 활성화하려면 `build.gradle(.kts)` 파일에 다음 컴파일러 옵션을 추가해야 합니다:

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128/KJS-Use-BigInt-to-represent-Long-values-in-ES6-mode)에서 피드백을 공유해 주세요.

#### 내보낸 선언에서 `Long` 사용하기

Kotlin의 `Long` 타입은 JavaScript의 `BigInt` 타입으로 컴파일될 수 있으므로, Kotlin/JS는 JavaScript로 `Long` 값을 내보내는 것을 지원합니다.

이 기능을 활성화하려면:

1. Kotlin/JS에서 `Long` 내보내기를 허용합니다. `build.gradle(.kts)` 파일의 `freeCompilerArgs` 속성에 다음 컴파일러 옵션을 추가합니다:

 ```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions { 
            freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
        }
    }
}
```

2. `BigInt` 타입을 활성화합니다. 활성화 방법은 [Kotlin의 `Long` 타입을 표현하기 위해 `BigInt` 타입 사용하기](#use-bigint-type-to-represent-kotlin-s-long-type)를 참고하세요.

### Kotlin의 `LongArray` 타입을 표현하기 위해 `BigInt64Array` 타입 사용하기
<primary-label ref="experimental-general"/>

Kotlin/JS는 JavaScript로 컴파일할 때 Kotlin의 `LongArray` 값을 표현하기 위해 JavaScript의 기본 `BigInt64Array` 타입을 사용할 수 있습니다.

`BigInt64Array` 타입 지원을 활성화하려면 `build.gradle(.kts)` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray)에서 피드백을 공유해 주세요.

## JavaScript에서의 Kotlin 타입

Kotlin 타입이 JavaScript 타입으로 어떻게 매핑되는지 확인하세요:

| Kotlin                                                           | JavaScript                | 설명                                                                                                |
|------------------------------------------------------------------|---------------------------|---------------------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                        | `Number`                  |                                                                                                         |
| `Char`                                                           | `Number`                  | 숫자는 문자의 코드를 나타냅니다.                                                             |
| `Long`                                                           | `BigInt`                  | [`-Xes-long-as-bigint` 컴파일러 옵션](compiler-reference.md#xes-long-as-bigint) 설정이 필요합니다. |
| `Boolean`                                                        | `Boolean`                 |                                                                                                         |
| `String`                                                         | `String`                  |                                                                                                         |
| `Array`                                                          | `Array`                   |                                                                                                         |
| `ByteArray`                                                      | `Int8Array`               |                                                                                                         |
| `ShortArray`                                                     | `Int16Array`              |                                                                                                         |
| `IntArray`                                                       | `Int32Array`              |                                                                                                         |
| `CharArray`                                                      | `UInt16Array`             | `$type$ == "CharArray"` 프로퍼티를 가집니다.                                                           |
| `FloatArray`                                                     | `Float32Array`            |                                                                                                         |
| `DoubleArray`                                                    | `Float64Array`            |                                                                                                         |
| `LongArray`                                                      | `BigInt64Array`           |                                                                                                         |
| `BooleanArray`                                                   | `Int8Array`               | `$type$ == "BooleanArray"` 프로퍼티를 가집니다.                                                        |
| `List`, `MutableList`                                            | `KtList`, `KtMutableList` | `KtList.asJsReadonlyArrayView` 또는 `KtMutableList.asJsArrayView`를 통해 `Array`를 노출합니다.                 |
| `Map`, `MutableMap`                                              | `KtMap`, `KtMutableMap`   | `KtMap.asJsReadonlyMapView` 또는 `KtMutableMap.asJsMapView`를 통해 ES2015 `Map`을 노출합니다.                  |
| `Set`, `MutableSet`                                              | `KtSet`, `KtMutableSet`   | `KtSet.asJsReadonlySetView` 또는 `KtMutableSet.asJsSetView`를 통해 ES2015 `Set`을 노출합니다.                  |
| `Unit`                                                           | Undefined                 | 반환 타입으로 사용될 때는 내보낼 수 있지만, 매개변수 타입으로 사용될 때는 내보낼 수 없습니다.                               |
| `Any`                                                            | `Object`                  |                                                                                                         |
| `Throwable`                                                      | `Error`                   |                                                                                                         |
| `enum class Type`                                                | `Type`                    | 열거형 항목(Enum entries)은 정적 클래스 프로퍼티(`Type.ENTRY`)로 노출됩니다.                                     |
| Nullable `Type?`                                                 | `Type                     | null                                                                                                    | undefined` |                                                                                            |
| `@JsExport`가 표시된 타입을 제외한 모든 기타 Kotlin 타입 | 지원되지 않음             | Kotlin의 [부호 없는 정수 타입(unsigned integer types)](unsigned-integer-types.md)을 포함합니다.                                  |

추가로 다음 사항을 아는 것이 중요합니다:

* Kotlin은 `kotlin.Int`, `kotlin.Byte`, `kotlin.Short`, `kotlin.Char` 및 `kotlin.Long`에 대해 오버플로 세맨틱을 유지합니다.
* Kotlin은 런타임에 숫자 타입 간의 구분을 할 수 없으므로(`kotlin.Long` 제외), 다음 코드가 작동합니다:
  
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin은 JavaScript에서 객체 지연 초기화(lazy object initialization)를 유지합니다.