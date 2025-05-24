---
title: "계층적 프로젝트 구조"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform 프로젝트는 계층적 소스 세트 구조를 지원합니다.
즉, 일부 ([지원되는 대상](multiplatform-dsl-reference#targets))에 대해서만 공통 코드를 공유하기 위해 중간 소스 세트의 계층 구조를 구성할 수 있습니다. 중간 소스 세트를 사용하면 다음을 수행하는 데 도움이 됩니다.

* 일부 대상에 대해 특정 API를 제공합니다. 예를 들어 라이브러리는 Kotlin/Native 대상에 대해서만 중간 소스 세트에서 네이티브별 API를 추가할 수 있지만 Kotlin/JVM 대상에는 추가할 수 없습니다.
* 일부 대상에 대해 특정 API를 사용합니다. 예를 들어 Kotlin Multiplatform 라이브러리가 중간 소스 세트를 구성하는 일부 대상에 대해 제공하는 풍부한 API를 활용할 수 있습니다.
* 프로젝트에서 플랫폼 종속적 라이브러리를 사용합니다. 예를 들어 중간 iOS 소스 세트에서 iOS별 종속성에 액세스할 수 있습니다.

Kotlin 툴체인은 각 소스 세트가 해당 소스 세트가 컴파일되는 모든 대상에 사용 가능한 API에만 액세스할 수 있도록 보장합니다. 이렇게 하면 Windows별 API를 사용한 다음 macOS로 컴파일하여 런타임 시 링커 오류 또는 정의되지 않은 동작이 발생하는 경우를 방지할 수 있습니다.

소스 세트 계층 구조를 설정하는 데 권장되는 방법은 [기본 계층 구조 템플릿](#default-hierarchy-template)을 사용하는 것입니다.
이 템플릿은 가장 일반적인 경우를 다룹니다. 보다 고급 프로젝트가 있는 경우 [수동으로 구성](#manual-configuration)할 수 있습니다.
이것은 더 낮은 수준의 접근 방식입니다. 더 유연하지만 더 많은 노력과 지식이 필요합니다.

## 기본 계층 구조 템플릿

Kotlin Gradle 플러그인에는 기본 제공되는 기본 [계층 구조 템플릿](#see-the-full-hierarchy-template)이 있습니다.
여기에는 몇 가지 일반적인 사용 사례에 대해 미리 정의된 중간 소스 세트가 포함되어 있습니다.
플러그인은 프로젝트에 지정된 대상을 기반으로 해당 소스 세트를 자동으로 설정합니다.

다음은 공유 코드를 포함하는 프로젝트 모듈의 `build.gradle(.kts)` 파일입니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
</Tabs>

코드에서 대상 `androidTarget`, `iosArm64` 및 `iosSimulatorArm64`를 선언하면 Kotlin Gradle 플러그인이
템플릿에서 적절한 공유 소스 세트를 찾아 생성합니다. 결과 계층 구조는 다음과 같습니다.

<img src="/img/default-hierarchy-example.svg" alt="기본 계층 구조 템플릿 사용 예" style={{verticalAlign: 'middle'}}/>

색상이 지정된 소스 세트는 실제로 생성되어 프로젝트에 존재하지만 기본 템플릿의 회색 소스 세트는
무시됩니다. 예를 들어 프로젝트에 watchOS 대상이 없기 때문에 Kotlin Gradle 플러그인이 `watchos` 소스 세트를 생성하지 않았습니다.

`watchosArm64`와 같은 watchOS 대상을 추가하면 `watchos` 소스 세트가 생성되고 `apple`, `native` 및 `common` 소스 세트의 코드가 `watchosArm64`로도 컴파일됩니다.

Kotlin Gradle 플러그인은 기본 계층 구조
템플릿의 모든 소스 세트에 대해 타입 안전 및 정적 접근자를 모두 제공하므로 [수동 구성](#manual-configuration)과 비교하여 `by getting` 또는 `by creating` 구문 없이 해당 소스 세트를 참조할 수 있습니다.

해당하는 대상을 먼저 선언하지 않고 공유 모듈의 `build.gradle(.kts)` 파일에서 소스 세트에 액세스하려고 하면 경고가 표시됩니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

:::note
이 예에서 `apple` 및 `native` 소스 세트는 `iosArm64` 및 `iosSimulatorArm64` 대상으로만 컴파일됩니다.
이름에도 불구하고 전체 iOS API에 액세스할 수 있습니다.
이는 `native`와 같은 소스 세트의 경우 직관적이지 않을 수 있습니다. 이 소스 세트에서는 모든
네이티브 대상에서 사용할 수 있는 API만 액세스할 수 있을 것으로 예상할 수 있습니다. 이 동작은 나중에 변경될 수 있습니다.

:::

### 추가 구성

기본 계층 구조 템플릿을 조정해야 할 수도 있습니다. 이전에 `dependsOn` 호출을 사용하여 중간 소스를
[수동으로](#manual-configuration) 도입한 경우 기본
계층 구조 템플릿의 사용이 취소되고 다음 경고가 표시됩니다.

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

이 문제를 해결하려면 다음 중 하나를 수행하여 프로젝트를 구성하십시오.

* [수동 구성을 기본 계층 구조 템플릿으로 바꿉니다](#replacing-a-manual-configuration)
* [기본 계층 구조 템플릿에 추가 소스 세트를 만듭니다](#creating-additional-source-sets)
* [기본 계층 구조 템플릿에서 만든 소스 세트를 수정합니다](#modifying-source-sets)

#### 수동 구성 바꾸기

**사례**. 모든 중간 소스 세트는 현재 기본 계층 구조 템플릿으로 덮여 있습니다.

**해결 방법**. 공유 모듈의 `build.gradle(.kts)` 파일에서 모든 수동 `dependsOn()` 호출과 `by creating` 구문이 있는 소스 세트를 제거합니다. 모든 기본 소스 세트 목록을 확인하려면 [전체 계층 구조 템플릿](#see-the-full-hierarchy-template)을 참조하십시오.

#### 추가 소스 세트 만들기

**사례**. 기본 계층 구조 템플릿에서 아직 제공하지 않는 소스 세트를 추가하려고 합니다.
예를 들어 macOS와 JVM 대상 사이에 하나를 추가하려고 합니다.

**해결 방법**:

1. 공유 모듈의 `build.gradle(.kts)` 파일에서 `applyDefaultHierarchyTemplate()`을 명시적으로 호출하여 템플릿을 다시 적용합니다.
2. `dependsOn()`을 사용하여 추가 소스 세트를 [수동으로](#manual-configuration) 구성합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            jvmAndMacos {
                dependsOn(commonMain.get())
            }
            macosArm64Main {
                dependsOn(jvmAndMacos.get())
            }
            jvmMain {
                dependsOn(jvmAndMacos.get())
            }
        } 
    }
    ```

    </TabItem>
    </Tabs>

#### 소스 세트 수정

**사례**. 이미 템플릿에서 생성된 것과 정확히 동일한 이름을 가진 소스 세트가 있지만 프로젝트에서 다른 대상 세트 간에 공유됩니다. 예를 들어 `nativeMain` 소스 세트는 데스크톱 전용
대상인 `linuxX64`, `mingwX64` 및 `macosX64` 간에만 공유됩니다.

**해결 방법**. 현재 템플릿의 소스 세트 간에 기본 `dependsOn` 관계를 수정할 방법은 없습니다.
또한 예를 들어
`nativeMain`과 같은 소스 세트의 구현 및 의미가 모든 프로젝트에서 동일해야 합니다.

그러나 다음 중 하나를 수행할 수 있습니다.

* 기본 계층 구조 템플릿 또는 수동으로 생성된 템플릿에서 목적에 맞는 다른 소스 세트를 찾습니다.
* `gradle.properties` 파일에 `kotlin.mpp.applyDefaultHierarchyTemplate=false`를 추가하여 템플릿을 완전히 해제하고 모든 소스 세트를 수동으로 구성합니다.

:::tip
현재 사용자 지정 계층 구조 템플릿을 만드는 API를 작업 중입니다. 이는 기본 템플릿과 크게 다른 계층 구조 구성을 가진 프로젝트에 유용합니다.

이 API는 아직 준비되지 않았지만 사용해 보고 싶다면
`applyHierarchyTemplate {}` 블록과 `KotlinHierarchyTemplate.default` 선언을 예로 살펴보십시오.
이 API는 여전히 개발 중입니다. 테스트되지 않았을 수 있으며 이후 릴리스에서 변경될 수 있습니다.

:::

#### 전체 계층 구조 템플릿 보기

프로젝트가 컴파일되는 대상을 선언하면
플러그인이 지정된 대상을 기반으로 템플릿에서 공유 소스 세트를 선택하고 프로젝트에서 생성합니다.

<img src="/img/full-template-hierarchy.svg" alt="기본 계층 구조 템플릿" style={{verticalAlign: 'middle'}}/>
:::tip
이 예에서는 프로젝트의 프로덕션 부분만 표시하고 `Main` 접미사를 생략합니다.
(예: `commonMain` 대신 `common` 사용). 그러나 `*Test` 소스에도 모든 것이 동일합니다.

:::

## 수동 구성

소스 세트 구조에 중간 소스를 수동으로 도입할 수 있습니다.
여기에는 여러 대상에 대한 공유 코드가 포함됩니다.

예를 들어 네이티브 Linux,
Windows 및 macOS 대상(`linuxX64`, `mingwX64` 및 `macosX64`) 간에 코드를 공유하려는 경우 수행할 작업은 다음과 같습니다.

1. 공유 모듈의 `build.gradle(.kts)` 파일에서 이러한 대상에 대한 공유
   논리를 보유하는 중간 소스 세트 `desktopMain`을 추가합니다.
2. `dependsOn` 관계를 사용하여 소스 세트 계층 구조를 설정합니다. `commonMain`을 `desktopMain`과 연결한 다음
   `desktopMain`을 각 대상 소스 세트와 연결합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val desktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(desktopMain)
            mingwX64Main.get().dependsOn(desktopMain)
            macosX64Main.get().dependsOn(desktopMain)
        }
    }
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            desktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(desktopMain)
            }
            mingwX64Main {
                dependsOn(desktopMain)
            }
            macosX64Main {
                dependsOn(desktopMain)
            }
        }
    }
    ```
    
    </TabItem>
    </Tabs>

결과 계층 구조는 다음과 같습니다.

<img src="/img/manual-hierarchical-structure.svg" alt="수동으로 구성된 계층 구조" style={{verticalAlign: 'middle'}}/>

다음 대상 조합에 대해 공유 소스 세트를 가질 수 있습니다.

* JVM 또는 Android + JS + Native
* JVM 또는 Android + Native
* JS + Native
* JVM 또는 Android + JS
* Native

Kotlin은 현재 이러한 조합에 대한 소스 세트 공유를 지원하지 않습니다.

* 여러 JVM 대상
* JVM + Android 대상
* 여러 JS 대상

공유 네이티브 소스 세트에서 플랫폼별 API에 액세스해야 하는 경우 IntelliJ IDEA를 사용하면 공유 네이티브 코드에서 사용할 수 있는 공통
선언을 감지하는 데 도움이 됩니다.
다른 경우에는 Kotlin의 [예상 및 실제 선언](multiplatform-expect-actual) 메커니즘을 사용하십시오.