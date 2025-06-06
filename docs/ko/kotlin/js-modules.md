[//]: # (title: JavaScript 모듈)

Kotlin 프로젝트를 다양한 인기 모듈 시스템의 JavaScript 모듈로 컴파일할 수 있습니다. 현재 다음 JavaScript 모듈 구성을 지원합니다:

- [통합 모듈 정의(UMD)](https://github.com/umdjs/umd)는 *AMD* 및 *CommonJS*와 모두 호환됩니다.
    UMD 모듈은 가져오지 않거나 모듈 시스템이 없는 경우에도 실행할 수 있습니다. 이는 `browser` 및 `nodejs` 타겟의 기본 옵션입니다.
- 특히 [RequireJS](https://requirejs.org/) 라이브러리에서 사용되는 [비동기 모듈 정의(AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD).
- Node.js/npm에서 널리 사용되는 [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) (`require` 함수 및 `module.exports` 객체).
- Plain. 어떤 모듈 시스템으로도 컴파일하지 않습니다. 전역 스코프에서 이름으로 모듈에 접근할 수 있습니다.

## 브라우저 타겟

웹 브라우저 환경에서 코드를 실행할 예정이며 UMD 이외의 모듈 시스템을 사용하려면, `webpackTask` 구성 블록에서 원하는 모듈 유형을 지정할 수 있습니다. 예를 들어, CommonJS로 전환하려면 다음을 사용합니다:

```groovy
kotlin {
    js {
        browser {
            webpackTask {
                output.libraryTarget = "commonjs2"
            }
        }
        binaries.executable()
    }
}
```

Webpack은 선언이 사용 가능하게 되는 방식에 영향을 미치는 두 가지 CommonJS flavor인 `commonjs`와 `commonjs2`를 제공합니다. 대부분의 경우 생성된 라이브러리에 `module.exports` 구문을 추가하는 `commonjs2`를 원할 것입니다. 또는 CommonJS 사양을 엄격하게 준수하는 `commonjs` 옵션을 선택할 수도 있습니다. `commonjs`와 `commonjs2`의 차이점에 대해 자세히 알아보려면 [Webpack 저장소](https://github.com/webpack/webpack/issues/1114)를 참조하세요.

## JavaScript 라이브러리 및 Node.js 파일

JavaScript 또는 Node.js 환경에서 사용할 라이브러리를 생성하고 다른 모듈 시스템을 사용하려면, 지침이 약간 다릅니다.

### 타겟 모듈 시스템 선택

타겟 모듈 시스템을 선택하려면 Gradle 빌드 스크립트에서 `moduleKind` 컴파일러 옵션을 설정합니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.js.ir.KotlinJsIrLink> {
    compilerOptions.moduleKind.set(org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlinJs.compilerOptions.moduleKind = org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS
```

</tab>
</tabs>

사용 가능한 값은: `umd`(기본값), `commonjs`, `amd`, `plain`입니다.

> 이는 `webpackTask.output.libraryTarget`을 조정하는 것과는 다릅니다. 라이브러리 타겟은 (코드가 이미 컴파일된 후) _Webpack이 생성하는_ 출력을 변경합니다. `compilerOptions.moduleKind`는 _Kotlin 컴파일러가 생성하는_ 출력을 변경합니다.
> {style="note"}

Kotlin Gradle DSL에는 CommonJS 모듈 종류를 설정하는 단축키도 있습니다:

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModule 어노테이션

Kotlin에게 `external` 클래스, 패키지, 함수 또는 프로퍼티가 JavaScript 모듈임을 알리려면 `@JsModule` 어노테이션을 사용할 수 있습니다. "hello"라는 다음 CommonJS 모듈이 있다고 가정해 봅시다:

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

Kotlin에서는 다음과 같이 선언해야 합니다:

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### @JsModule을 패키지에 적용

일부 JavaScript 라이브러리는 함수와 클래스 대신 패키지(네임스페이스)를 내보냅니다. JavaScript 관점에서 보면, 클래스, 함수, 프로퍼티인 *멤버*를 가지는 *객체*입니다. 이러한 패키지를 Kotlin 객체로 가져오는 것은 종종 부자연스럽게 보입니다. 컴파일러는 다음 표기법을 사용하여 가져온 JavaScript 패키지를 Kotlin 패키지에 매핑할 수 있습니다:

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

해당 JavaScript 모듈은 다음과 같이 선언됩니다:

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

`@file:JsModule` 어노테이션으로 표시된 파일은 non-external 멤버를 선언할 수 없습니다. 아래 예시는 컴파일 타임 에러를 발생시킵니다:

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

### 더 깊은 패키지 계층 구조 가져오기

이전 예시에서는 JavaScript 모듈이 단일 패키지를 내보냅니다. 하지만 일부 JavaScript 라이브러리는 하나의 모듈 내에서 여러 패키지를 내보냅니다. 이 경우도 Kotlin에서 지원되지만, 가져오는 각 패키지에 대해 새로운 `.kt` 파일을 선언해야 합니다.

예를 들어, 예시를 좀 더 복잡하게 만들어 봅시다:

```javascript
module.exports = {
  mylib: {
    pkg1: {
      foo: function () { /* some code here */ },
      bar: function () { /* some code here */ }
    },
    pkg2: {
      baz: function () { /* some code here */ }
    }
  }
}
```

Kotlin에서 이 모듈을 가져오려면 두 개의 Kotlin 소스 파일을 작성해야 합니다:

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")

package extlib.pkg1

external fun foo()

external fun bar()
```

and

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")

package extlib.pkg2

external fun baz()
```

### @JsNonModule 어노테이션

선언이 `@JsModule`로 표시되면, JavaScript 모듈로 컴파일하지 않을 경우 Kotlin 코드에서 사용할 수 없습니다. 일반적으로 개발자는 라이브러리를 JavaScript 모듈과 프로젝트의 정적 리소스에 복사하여 `<script>` 태그를 통해 포함할 수 있는 다운로드 가능한 `.js` 파일 형태로 모두 배포합니다. Kotlin에게 `@JsModule` 선언을 비모듈 환경에서 사용해도 괜찮다고 알리려면 `@JsNonModule` 어노테이션을 추가하세요. 예를 들어, 다음 JavaScript 코드를 살펴보세요:

```javascript
function topLevelSayHello (name) { alert("Hello, " + name); }

if (module && module.exports) {
  module.exports = topLevelSayHello;
}
```

Kotlin에서는 다음과 같이 설명할 수 있습니다:

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

### Kotlin 표준 라이브러리에서 사용되는 모듈 시스템

Kotlin은 Kotlin/JS 표준 라이브러리를 단일 파일로 배포하며, 이 파일 자체는 UMD 모듈로 컴파일되므로 위에 설명된 모든 모듈 시스템과 함께 사용할 수 있습니다. 대부분의 Kotlin/JS 사용 사례에서는 `kotlin-stdlib-js`에 대한 Gradle 종속성을 사용하는 것이 권장되며, 이는 NPM에서도 [`kotlin`](https://www.npmjs.com/package/kotlin) 패키지로 제공됩니다.