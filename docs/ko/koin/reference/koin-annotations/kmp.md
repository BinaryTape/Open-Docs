---
title: Kotlin 멀티플랫폼 - 정의 및 모듈 어노테이션
---

## KSP 설정

공식 문서인 [Kotlin 멀티플랫폼에서 KSP](https://kotlinlang.org/docs/ksp-multiplatform.html)에 설명된 대로 KSP 설정을 따르세요.

Koin 어노테이션의 기본 설정이 적용된 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 프로젝트도 확인할 수 있습니다.

KSP 플러그인 추가

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

공통 API에서 어노테이션 라이브러리 사용:

```kotlin
sourceSets {
    commonMain.dependencies {
        implementation(libs.koin.core)
        api(libs.koin.annotations)
        // ...
    }
}
```

그리고 올바른 sourceSet에 KSP를 구성하는 것을 잊지 마세요:

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## 공통 코드에서 정의 및 모듈 정의하기

여러분의 `commonMain` sourceSet에서, 모듈을 선언하거나, 정의를 스캔하거나, 일반적인 Kotlin Koin 선언으로 함수를 정의하세요. [정의](definitions.md) 및 [모듈](./modules.md)을 참조하세요.

## 공유 패턴

이 섹션에서는 정의 및 모듈과 함께 컴포넌트를 공유하는 여러 가지 방법을 함께 살펴보겠습니다.

Kotlin 멀티플랫폼 애플리케이션에서는 일부 컴포넌트가 플랫폼별로 특정하게 구현되어야 합니다. 해당 컴포넌트는 주어진 클래스(정의 또는 모듈)에 expect/actual을 사용하여 정의 수준에서 공유할 수 있습니다.
정의를 expect/actual 구현으로 공유하거나, 모듈을 expect/actual로 공유할 수 있습니다.

:::info
일반적인 Kotlin 지침은 [멀티플랫폼 Expect & Actual 규칙](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) 문서를 참조하세요.
:::

:::warning
Expect/Actual 클래스는 플랫폼별로 다른 생성자를 가질 수 없습니다. 공통 공간에서 설계된 현재 생성자 계약을 준수해야 합니다.
:::

### 네이티브 구현을 위한 정의 공유

:::info
공통 모듈 + Expect/Actual 클래스 정의를 사용하여 공유하는 것을 목표로 합니다
:::

이 첫 번째 일반적인 패턴의 경우, `@ComponentScan`을 사용하여 정의를 스캔하거나 모듈 클래스 함수로 정의를 선언할 수 있습니다.

expect/actual 정의를 사용하려면 동일한 생성자(기본 생성자 또는 사용자 정의 생성자)를 사용해야 한다는 점에 유의하세요. 이 생성자는 모든 플랫폼에서 동일해야 합니다.  

#### Expect/Actual 정의 스캔하기

commonMain에서:
```kotlin
// commonMain

@Module
@ComponentScan("com.jetbrains.kmpapp.native")
class NativeModuleA()

// package com.jetbrains.kmpapp.native
@Factory
expect class PlatformComponentA() {
    fun sayHello() : String
}
```

네이티브 소스에서, 실제 클래스를 구현하세요:

```kotlin
// androidMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA {
    actual fun sayHello() : String = "I'm Android - A"
}

// iOSMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA {
    actual fun sayHello() : String = "I'm iOS - A"
}
```

#### Expect/Actual 함수 정의 선언하기

commonMain에서:
```kotlin
// commonMain

@Module
class NativeModuleB() {

    @Factory
    fun providesPlatformComponentB() : PlatformComponentB = PlatformComponentB()
}

expect class PlatformComponentB() {
    fun sayHello() : String
}
```

네이티브 소스에서, 실제 클래스를 구현하세요:

```kotlin
// androidMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentB {
    actual fun sayHello() : String = "I'm Android - B"
}

// iOSMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentB {
    actual fun sayHello() : String = "I'm iOS - B"
}
```

### 서로 다른 네이티브 계약으로 정의 공유하기

:::info
Expect/Actual 공통 모듈 + 공통 인터페이스 + 네이티브 구현을 목표로 합니다
:::

어떤 경우에는 각 네이티브 구현에서 다른 생성자 인수가 필요할 수 있습니다. 이때 Expect/Actual 클래스는 해결책이 아닙니다. 
각 플랫폼에서 구현할 `interface`를 사용해야 하며, 모듈이 올바른 플랫폼 구현을 정의할 수 있도록 Expect/Actual 클래스 모듈을 사용해야 합니다:

commonMain에서:
```kotlin
// commonMain

expect class NativeModuleD() {
    @Factory
    fun providesPlatformComponentD(scope : org.koin.core.scope.Scope) : PlatformComponentD
}

interface PlatformComponentD {
    fun sayHello() : String
}
```

네이티브 소스에서, 실제 클래스를 구현하세요:

```kotlin
// androidMain

@Module
actual class NativeModuleD {
    @Factory
    actual fun providesPlatformComponentD(scope : org.koin.core.scope.Scope) : PlatformComponentD = PlatformComponentDAndroid(scope)
}

class PlatformComponentDAndroid(scope : org.koin.core.scope.Scope) : PlatformComponentD{
    val context : Context = scope.get()
    override fun sayHello() : String = "I'm Android - D - with ${context}"
}

// iOSMain
@Module
actual class NativeModuleD {
    @Factory
    actual fun providesPlatformComponentD(scope : org.koin.core.scope.Scope) : PlatformComponentD = PlatformComponentDiOS()
}

class PlatformComponentDiOS : PlatformComponentD{
    override fun sayHello() : String = "I'm iOS - D"
}
```

:::note
Koin 스코프에 수동으로 접근할 때마다 동적 와이어링을 수행하는 것입니다. 컴파일 안전성은 이러한 와이어링을 다루지 않습니다.
:::

### 플랫폼 래퍼로 플랫폼 간 안전하게 공유하기

:::info
특정 플랫폼 컴포넌트를 "플랫폼 래퍼"로 감싸기
:::

특정 플랫폼 컴포넌트를 "플랫폼 래퍼"로 감싸서 동적 주입을 최소화하는 데 도움을 줄 수 있습니다.

예를 들어, 필요할 때 Android `Context`를 주입할 수 있게 하지만 iOS 측에는 영향을 미치지 않는 `ContextWrapper`를 만들 수 있습니다.

commonMain에서:
```kotlin
// commonMain

expect class ContextWrapper

@Module
expect class ContextModule() {

    @Single
    fun providesContextWrapper(scope : Scope) : ContextWrapper
}
```

네이티브 소스에서, 실제 클래스를 구현하세요:

```kotlin
// androidMain
actual class ContextWrapper(val context: Context)

@Module
actual class ContextModule {
    
    // needs androidContext() to be setup at start
    @Single
    actual fun providesContextWrapper(scope : Scope) : ContextWrapper = ContextWrapper(scope.get())
}

// iOSMain
actual class ContextWrapper

@Module
actual class ContextModule {

    @Single
    actual fun providesContextWrapper(scope : Scope) : ContextWrapper = ContextWrapper()
}
```

:::info
이러한 방식으로 동적 플랫폼 와이어링을 하나의 정의로 최소화하고, 전체 시스템에 안전하게 주입할 수 있습니다.
:::

이제 공통 코드에서 `ContextWrapper`를 사용하고 Expect/Actual 클래스에 쉽게 전달할 수 있습니다:

commonMain에서:
```kotlin
// commonMain

@Module
@ComponentScan("com.jetbrains.kmpapp.native")
class NativeModuleA()

// package com.jetbrains.kmpapp.native
@Factory
expect class PlatformComponentA(ctx : ContextWrapper) {
    fun sayHello() : String
}
```

네이티브 소스에서, 실제 클래스를 구현하세요:

```kotlin
// androidMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA actual constructor(val ctx : ContextWrapper) {
    actual fun sayHello() : String = "I'm Android - A - with context: ${ctx.context}"
}

// iOSMain

// package com.jetbrains.kmpapp.native
actual class PlatformComponentA actual constructor(val ctx : ContextWrapper) {
    actual fun sayHello() : String = "I'm iOS - A"
}
```

### Expect/Actual 모듈 공유 - 네이티브 모듈 스캔에 의존

:::info
공통 모듈에서 네이티브 모듈에 의존합니다
:::

어떤 경우에는 제약 조건을 두지 않고 각 네이티브 측에서 컴포넌트를 스캔하고 싶을 수 있습니다. 공통 소스 세트에 빈 모듈 클래스를 정의하고 각 플랫폼에서 구현을 정의하세요.

:::info
공통 측에 빈 모듈을 정의하면, 각 네이티브 모듈 구현은 각 네이티브 타겟에서 생성되어 예를 들어 네이티브 전용 컴포넌트를 스캔할 수 있습니다.
:::

commonMain에서:
```kotlin
// commonMain

@Module
expect class NativeModuleC()
```

네이티브 소스 세트에서:

```kotlin
// androidMain
@Module
@ComponentScan("com.jetbrains.kmpapp.other.android")
actual class NativeModuleC

//com.jetbrains.kmpapp.other.android
@Factory
class PlatformComponentC(val context: Context) {
    fun sayHello() : String = "I'm Android - C - $context"
}

// iOSMain
// do nothing on iOS
@Module
actual class NativeModuleC