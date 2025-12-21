[//]: # (title: Kotlin/Native를 Apple 프레임워크로 사용하기 – 튜토리얼)

> Objective-C 라이브러리 임포트는 [베타](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 단계에 있습니다.
> cinterop 도구를 통해 Objective-C 라이브러리에서 생성된 모든 Kotlin 선언에는
> `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
>
> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는
> 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="note"}

Kotlin/Native는 Swift/Objective-C와의 양방향 상호 운용성(interoperability)을 제공합니다. Kotlin 코드에서 Objective-C 프레임워크와 라이브러리를 사용할 수도 있고, Swift/Objective-C 코드에서 Kotlin 모듈을 사용할 수도 있습니다.

Kotlin/Native는 미리 임포트된 시스템 프레임워크 세트와 함께 제공되며, 기존 프레임워크를 임포트하여 Kotlin에서 사용하는 것도 가능합니다. 이 튜토리얼에서는 macOS 및 iOS에서 Swift/Objective-C 애플리케이션에서 Kotlin/Native 코드를 사용할 수 있도록 자신만의 프레임워크를 생성하는 방법을 배웁니다.

이 튜토리얼에서는 다음을 수행합니다:

*   [Kotlin 라이브러리 생성 및 프레임워크로 컴파일](#create-a-kotlin-library)
*   [생성된 Swift/Objective-C API 코드 검토](#generated-framework-headers)
*   [Objective-C에서 프레임워크 사용](#use-code-from-objective-c)
*   [Swift에서 프레임워크 사용](#use-code-from-swift)

Kotlin 프레임워크를 생성하기 위해 명령줄(command line)을 직접 사용하거나 스크립트 파일(예: `.sh` 또는 `.bat` 파일)을 사용할 수 있습니다. 그러나 이 접근 방식은 수백 개의 파일과 라이브러리가 있는 대규모 프로젝트에는 적합하지 않습니다. 빌드 시스템을 사용하면 Kotlin/Native 컴파일러 바이너리 및 전이적 의존성(transitive dependencies)을 가진 라이브러리를 다운로드하고 캐싱하며, 컴파일러 및 테스트를 실행하여 프로세스를 간소화합니다. Kotlin/Native는 [Kotlin 멀티플랫폼 플러그인](gradle-configure-project.md#targeting-multiple-platforms)을 통해 [Gradle](https://gradle.org) 빌드 시스템을 사용할 수 있습니다.

> Mac을 사용하며 iOS 또는 다른 Apple 타겟용 애플리케이션을 생성하고 실행하려면, 먼저 [Xcode 명령줄 도구](https://developer.apple.com/download/)를 설치하고, 실행하여 라이선스 약관에 동의해야 합니다.
>
{style="note"}

## Kotlin 라이브러리 생성

> [Kotlin/Native 시작하기](native-get-started.md#using-gradle) 튜토리얼에서 자세한 첫 단계와 새로운 Kotlin/Native 프로젝트를 생성하고 IntelliJ IDEA에서 여는 방법에 대한 지침을 참조하십시오.
>
{style="tip"}

Kotlin/Native 컴파일러는 Kotlin 코드로부터 macOS 및 iOS용 프레임워크를 생성할 수 있습니다. 생성된 프레임워크에는 Swift/Objective-C와 함께 사용하는 데 필요한 모든 선언(declarations) 및 바이너리(binaries)가 포함되어 있습니다.

먼저 Kotlin 라이브러리를 생성해 봅시다:

1.  `src/nativeMain/kotlin` 디렉터리에 라이브러리 내용을 담은 `lib.kt` 파일을 생성합니다.

    ```kotlin
    package example
     
    object Object {
        val field = "A"
    }
     
    interface Interface {
        fun iMember() {}
    }
     
    class Clazz : Interface {
        fun member(p: Int): ULong? = 42UL
    }
     
    fun forIntegers(b: Byte, s: UShort, i: Int, l: ULong?) { }
    fun forFloats(f: Float, d: Double?) { }
     
    fun strings(str: String?) : String {
        return "That is '$str' from C"
    }
     
    fun acceptFun(f: (String) -> String?) = f("Kotlin/Native rocks!")
    fun supplyFun() : (String) -> String? = { "$it is cool!" }
    ```

2.  `build.gradle(.kts)` Gradle 빌드 파일을 다음과 같이 업데이트합니다:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        iosArm64("native") {
            binaries {
                framework {
                    baseName = "Demo"
                }
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.ALL
    }
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        iosArm64("native") {
            binaries {
                framework {
                    baseName = "Demo"
                }
            }
        }
    }
    
    wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = "ALL"
    }
    ```
    
    </tab>
    </tabs>

    `binaries {}` 블록은 동적 라이브러리 또는 공유 라이브러리를 생성하도록 프로젝트를 구성합니다.

    Kotlin/Native는 iOS용 `iosArm64`, `iosX64`, `iosSimulatorArm64` 타겟과 macOS용 `macosArm64`, `macosX64` 타겟을 지원합니다. 따라서 `iosArm64()`를 해당 타겟 플랫폼에 맞는 Gradle 함수로 대체할 수 있습니다.

    | 타겟 플랫폼/장치       | Gradle 함수           |
    |------------------------|-----------------------|
    | macOS ARM64            | `macosArm64()`        |
    | macOS x86_64           | `macosX64()`          |
    | iOS ARM64              | `iosArm64()`          |
    | iOS 시뮬레이터 (ARM64)  | `iosSimulatorArm64()` |
    | iOS 시뮬레이터 (x86_64) | `iosX64()`            |

    다른 지원되는 Apple 타겟에 대한 자세한 정보는 [Kotlin/Native 타겟 지원](native-target-support.md)을 참조하십시오.

3.  IDE에서 `linkDebugFrameworkNative` Gradle 작업을 실행하거나 터미널에서 다음 콘솔 명령어를 사용하여 프레임워크를 빌드합니다.

    ```bash
    ./gradlew linkDebugFrameworkNative
    ```

빌드는 `build/bin/native/debugFramework` 디렉터리에 프레임워크를 생성합니다.

> `linkNative` Gradle 작업을 사용하여 프레임워크의 `debug` 및 `release` 버전을 모두 생성할 수도 있습니다.
>
{style="tip"}

## 생성된 프레임워크 헤더

각 프레임워크 버전에는 헤더 파일이 포함되어 있습니다. 헤더는 타겟 플랫폼에 의존하지 않습니다. 헤더 파일에는 Kotlin 코드와 몇 가지 Kotlin 전반의 선언에 대한 정의가 포함되어 있습니다. 내용을 살펴보겠습니다.

### Kotlin/Native 런타임 선언

`build/bin/native/debugFramework/Demo.framework/Headers` 디렉터리에서 `Demo.h` 헤더 파일을 엽니다.
Kotlin 런타임 선언을 살펴보십시오.

```objc
NS_ASSUME_NONNULL_BEGIN
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-warning-option"
#pragma clang diagnostic ignored "-Wincompatible-property-type"
#pragma clang diagnostic ignored "-Wnullability"

#pragma push_macro("_Nullable_result")
#if !__has_feature(nullability_nullable_result)
#undef _Nullable_result
#define _Nullable_result _Nullable
#endif

__attribute__((swift_name("KotlinBase")))
@interface DemoBase : NSObject
- (instancetype)init __attribute__((unavailable));
+ (instancetype)new __attribute__((unavailable));
+ (void)initialize __attribute__((objc_requires_super));
@end

@interface DemoBase (DemoBaseCopying) <NSCopying>
@end

__attribute__((swift_name("KotlinMutableSet")))
@interface DemoMutableSet<ObjectType> : NSMutableSet<ObjectType>
@end

__attribute__((swift_name("KotlinMutableDictionary")))
@interface DemoMutableDictionary<KeyType, ObjectType> : NSMutableDictionary<KeyType, ObjectType>
@end

@interface NSError (NSErrorDemoKotlinException)
@property (readonly) id _Nullable kotlinException;
@end
```

Kotlin 클래스는 Swift/Objective-C에서 `NSObject` 클래스를 확장하는 `KotlinBase`라는 기본 클래스를 가집니다.
컬렉션 및 예외를 위한 래퍼(wrapper)도 있습니다. 대부분의 컬렉션 타입은 Swift/Objective-C의 유사한 컬렉션 타입에 매핑됩니다.

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlin 숫자 및 NSNumber

`Demo.h` 파일의 다음 부분에는 Kotlin/Native 숫자 타입과 `NSNumber` 간의 타입 매핑이 포함됩니다. 기본 클래스는 Objective-C에서는 `DemoNumber`, Swift에서는 `KotlinNumber`라고 불립니다. 이는 `NSNumber`를 확장합니다.

각 Kotlin 숫자 타입에 대해 해당하는 미리 정의된 자식 클래스가 있습니다.

| Kotlin    | Swift           | Objective-C        | 단순 타입              |
|-----------|-----------------|--------------------|----------------------|
| `-`       | `KotlinNumber`  | `<Package>Number`  | `-`                  |
| `Byte`    | `KotlinByte`    | `<Package>Byte`    | `char`               |
| `UByte`   | `KotlinUByte`   | `<Package>UByte`   | `unsigned char`      |
| `Short`   | `KotlinShort`   | `<Package>Short`   | `short`              |
| `UShort`  | `KotlinUShort`  | `<Package>UShort`  | `unsigned short`     |
| `Int`     | `KotlinInt`     | `<Package>Int`     | `int`                |
| `UInt`    | `KotlinUInt`    | `<Package>UInt`    | `unsigned int`       |
| `Long`    | `KotlinLong`    | `<Package>Long`    | `long long`          |
| `ULong`   | `KotlinULong`   | `<Package>ULong`   | `unsigned long long` |
| `Float`   | `KotlinFloat`   | `<Package>Float`   | `float`              |
| `Double`  | `KotlinDouble`  | `<Package>Double`  | `double`             |
| `Boolean` | `KotlinBoolean` | `<Package>Boolean` | `BOOL/Bool`          |

모든 숫자 타입은 해당 단순 타입으로부터 새 인스턴스를 생성하는 클래스 메서드를 가집니다. 또한, 단순 값을 다시 추출하는 인스턴스 메서드도 있습니다. 모든 선언은 다음과 같이 도식적으로 표현됩니다.

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

여기서 `__TYPE__`은 단순 타입 이름 중 하나이며, `__CTYPE__`은 해당하는 Objective-C 타입입니다 (예: `initWithChar(char)`).

이러한 타입은 박싱된 Kotlin 숫자 타입을 Swift/Objective-C에 매핑하는 데 사용됩니다.
Swift에서는 생성자를 호출하여 인스턴스를 생성할 수 있습니다(예: `KotlinLong(value: 42)`).

### Kotlin의 클래스 및 객체

`class`와 `object`가 Swift/Objective-C에 어떻게 매핑되는지 살펴보겠습니다. 생성된 `Demo.h` 파일에는 `Class`, `Interface`, `Object`에 대한 정확한 정의가 포함되어 있습니다.

```objc
__attribute__((swift_name("Interface")))
@protocol DemoInterface
@required
- (void)iMember __attribute__((swift_name("iMember()")));
@end

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Clazz")))
@interface DemoClazz : DemoBase <DemoInterface>
- (instancetype)init __attribute__((swift_name("init()"))) __attribute__((objc_designated_initializer));
+ (instancetype)new __attribute__((availability(swift, unavailable, message="use object initializers instead")));
- (DemoULong * _Nullable)memberP:(int32_t)p __attribute__((swift_name("member(p:)")));
@end

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Object")))
@interface DemoObject : DemoBase
+ (instancetype)alloc __attribute__((unavailable));
+ (instancetype)allocWithZone:(struct _NSZone *)zone __attribute__((unavailable));
+ (instancetype)object __attribute__((swift_name("init()")));
@property (class, readonly, getter=shared) DemoObject *shared __attribute__((swift_name("shared")));
@property (readonly) NSString *field __attribute__((swift_name("field")));
@end
```

이 코드의 Objective-C 속성(attributes)은 Swift 및 Objective-C 언어 모두에서 프레임워크를 더 쉽게 사용할 수 있도록 도와줍니다. `DemoInterface`, `DemoClazz`, `DemoObject`는 각각 `Interface`, `Clazz`, `Object`를 위해 생성됩니다.

`Interface`는 `@protocol`로, `class`와 `object`는 모두 `@interface`로 표현됩니다. `Demo` 접두사는 프레임워크 이름에서 유래합니다. 널러블 반환 타입인 `ULong?`은 Objective-C에서 `DemoULong`으로 변환됩니다.

### Kotlin의 전역 선언

Kotlin의 모든 전역 함수는 Objective-C에서는 `DemoLibKt`로, Swift에서는 `LibKt`로 변환됩니다. 여기서 `Demo`는 `kotlinc-native`의 `-output` 파라미터로 설정된 프레임워크 이름입니다.

```objc
__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("LibKt")))
@interface DemoLibKt : DemoBase
+ (NSString * _Nullable)acceptFunF:(NSString * _Nullable (^)(NSString *))f __attribute__((swift_name("acceptFun(f:)")));
+ (void)forFloatsF:(float)f d:(DemoDouble * _Nullable)d __attribute__((swift_name("forFloats(f:d:)")));
+ (void)forIntegersB:(int8_t)b s:(uint16_t)s i:(int32_t)i l:(DemoULong * _Nullable)l __attribute__((swift_name("forIntegers(b:s:i:l:)")));
+ (NSString *)stringsStr:(NSString * _Nullable)str __attribute__((swift_name("strings(str:)")));
+ (NSString * _Nullable (^)(NSString *))supplyFun __attribute__((swift_name("supplyFun()")));
@end
```

Kotlin `String`과 Objective-C `NSString*`는 투명하게 매핑됩니다. 마찬가지로 Kotlin의 `Unit` 타입은 `void`에 매핑됩니다.
기본 타입(primitive types)은 직접 매핑됩니다. Non-nullable 기본 타입은 투명하게 매핑됩니다.
Nullable 기본 타입은 [Kotlin 숫자와 NSNumber](#kotlin-numbers-and-nsnumber) 테이블에 표시된 대로 `Kotlin<TYPE>*` 타입에 매핑됩니다.
고차 함수(higher-order functions)인 `acceptFunF`와 `supplyFun`은 모두 포함되어 있으며 Objective-C 블록을 받습니다.

타입 매핑에 대한 더 자세한 정보는 [Swift/Objective-C와의 상호 운용성](native-objc-interop.md#mappings)에서 찾을 수 있습니다.

## 가비지 컬렉션 및 참조 카운팅

Swift와 Objective-C는 자동 참조 카운팅(ARC)을 사용합니다. Kotlin/Native는 자체 [가비지 컬렉터](native-memory-manager.md#garbage-collector)를 가지고 있으며, 이는 [Swift/Objective-C ARC와도 통합](native-arc-integration.md)되어 있습니다.

사용되지 않는 Kotlin 객체는 자동으로 제거됩니다. Swift 또는 Objective-C에서 Kotlin/Native 인스턴스의 수명 주기(lifetime)를 제어하기 위해 추가적인 조치를 취할 필요가 없습니다.

## Objective-C에서 코드 사용

Objective-C에서 프레임워크를 호출해 보겠습니다. 프레임워크 디렉터리에 다음 코드를 포함하는 `main.m` 파일을 생성합니다.

```objc 
#import <Foundation/Foundation.h>
#import <Demo/Demo.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        [DemoObject.shared field];
        
        DemoClazz* clazz = [[ DemoClazz alloc] init];
        [clazz memberP:42];
        
        [DemoLibKt forIntegersB:1 s:1 i:3 l:[DemoULong numberWithUnsignedLongLong:4]];
        [DemoLibKt forIntegersB:1 s:1 i:3 l:nil];
        
        [DemoLibKt forFloatsF:2.71 d:[DemoDouble numberWithDouble:2.71]];
        [DemoLibKt forFloatsF:2.71 d:nil];
        
        NSString* ret = [DemoLibKt acceptFunF:^NSString * _Nullable(NSString * it) {
            return [it stringByAppendingString:@" Kotlin is fun"];
        }];
        
        NSLog(@"%@", ret);
        return 0;
    }
}
```

여기서 Objective-C 코드에서 Kotlin 클래스를 직접 호출합니다. Kotlin 객체는 `<object name>.shared` 클래스 프로퍼티를 사용하여 해당 객체의 유일한 인스턴스를 가져오고 객체 메서드를 호출할 수 있게 합니다.

널리 사용되는 패턴은 `Clazz` 클래스의 인스턴스를 생성하는 데 사용됩니다. Objective-C에서 `[[ DemoClazz alloc] init]`을 호출합니다. 파라미터가 없는 생성자의 경우 `[DemoClazz new]`를 사용할 수도 있습니다.

Kotlin 소스의 전역 선언은 Objective-C의 `DemoLibKt` 클래스 아래에 범위가 지정됩니다.
모든 Kotlin 함수는 해당 클래스의 클래스 메서드로 변환됩니다.

`strings` 함수는 Objective-C에서 `DemoLibKt.stringsStr` 함수로 변환되므로 `NSString`을 직접 전달할 수 있습니다. 반환 값도 `NSString`으로 표시됩니다.

## Swift에서 코드 사용

생성한 프레임워크에는 Swift에서 더 쉽게 사용할 수 있도록 헬퍼 속성(attributes)이 있습니다. [이전 Objective-C 예제](#use-code-from-objective-c)를 Swift로 변환해 보겠습니다.

프레임워크 디렉터리에 다음 코드를 포함하는 `main.swift` 파일을 생성합니다.

```swift
import Foundation
import Demo

let kotlinObject = Object.shared

let field = Object.shared.field

let clazz = Clazz()
clazz.member(p: 42)

LibKt.forIntegers(b: 1, s: 2, i: 3, l: 4)
LibKt.forFloats(f: 2.71, d: nil)

let ret = LibKt.acceptFun { "\($0) Kotlin is fun" }
if (ret != nil) {
    print(ret!)
}
``` 

원본 Kotlin 코드와 Swift 버전 사이에는 약간의 차이가 있습니다. Kotlin에서는 모든 객체 선언이 단 하나의 인스턴스를 가집니다. `Object.shared` 구문은 이 단일 인스턴스에 접근하는 데 사용됩니다.

Kotlin 함수 및 프로퍼티 이름은 그대로 번역됩니다. Kotlin의 `String`은 Swift의 `String`으로 변환됩니다. Swift는 `NSNumber*` 박싱(boxing)도 숨깁니다. 또한 Swift 클로저를 Kotlin에 전달하고 Kotlin 람다 함수를 Swift에서 호출할 수 있습니다.

타입 매핑에 대한 더 자세한 정보는 [Swift/Objective-C와의 상호 운용성](native-objc-interop.md#mappings)에서 찾을 수 있습니다.

## 프레임워크를 iOS 프로젝트에 연결

이제 생성된 프레임워크를 iOS 프로젝트에 의존성으로 연결할 수 있습니다. 이를 설정하고 자동화하는 여러 가지 방법이 있으니, 자신에게 가장 적합한 방법을 선택하십시오.

<a href="https://kotlinlang.org/docs/multiplatform/multiplatform-ios-integration-overview.html"><img src="choose-ios-integration.svg" width="700" alt="Choose iOS integration method" style="block"/></a>

## 다음 단계

*   [Objective-C와의 상호 운용성에 대해 자세히 알아보기](native-objc-interop.md)
*   [Kotlin에서 C와의 상호 운용성이 어떻게 구현되는지 확인하기](native-c-interop.md)
*   [동적 라이브러리로 Kotlin/Native 튜토리얼 확인하기](native-dynamic-libraries.md)