[//]: # (title: iOS와 Android 간 로직 더 많이 공유하기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이것은 <strong>공유 로직과 네이티브 UI를 사용하여 Kotlin Multiplatform 앱 만들기</strong> 튜토리얼의 네 번째 부분입니다. 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">Kotlin Multiplatform 앱 만들기</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-update-ui.md">사용자 인터페이스 업데이트하기</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-dependencies.md">의존성 추가하기</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>로직 더 많이 공유하기</strong><br/>
      <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 프로젝트 마무리하기<br/>
    </p>
</tldr>

이제 외부 의존성을 사용하여 공통 로직을 구현했으므로, 더 복잡한 로직을 추가할 수 있습니다. 네트워크 요청과 데이터 직렬화는 코틀린 멀티플랫폼을 사용하여 코드를 공유하는 [가장 일반적인 사용 사례](https://kotlinlang.org/lp/multiplatform/)입니다. 이 온보딩 과정을 완료한 후 향후 프로젝트에서 사용할 수 있도록, 첫 번째 애플리케이션에 이러한 기능을 구현하는 방법을 배우세요.

업데이트된 앱은 인터넷을 통해 [SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)에서 데이터를 가져와 SpaceX 로켓의 마지막 성공적인 발사 날짜를 표시합니다.

> 서로 다른 코루틴 솔루션을 사용하는 프로젝트의 최종 상태는 GitHub 저장소의 두 브랜치에서 찾을 수 있습니다.
> * [`main`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main) 브랜치에는 KMP-NativeCoroutines 구현이 포함되어 있습니다.
> * [`main-skie`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main-skie) 브랜치에는 SKIE 구현이 포함되어 있습니다.
>
{style="note"}

## 의존성 더 추가하기

프로젝트에 다음 멀티플랫폼 라이브러리를 추가해야 합니다:

* `kotlinx.coroutines`, 동시 작업을 허용하는 비동기 코드에 코루틴(coroutines)을 사용하기 위함.
* `kotlinx.serialization`, 네트워크 작업을 처리하는 데 사용되는 엔티티 클래스(entity classes)의 객체로 JSON 응답을 역직렬화(deserialize)하기 위함.
* [Ktor](https://ktor.io/), 인터넷을 통해 데이터를 가져오기 위한 HTTP 클라이언트(client)를 생성하는 프레임워크(framework).

### kotlinx.coroutines

프로젝트에 `kotlinx.coroutines`를 추가하려면 공통 소스 세트(common source set)에 의존성을 지정해야 합니다. 이를 위해, 공유 모듈(shared module)의 `build.gradle.kts` 파일에 다음 줄을 추가하세요:

```kotlin
kotlin {
    // ... 
    sourceSets {
        commonMain.dependencies {
           // ...
           implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

Multiplatform Gradle 플러그인(plugin)은 자동으로 `kotlinx.coroutines`의 플랫폼별(iOS 및 Android) 부분에 의존성을 추가합니다.

### kotlinx.serialization

`kotlinx.serialization` 라이브러리를 사용하려면 해당 Gradle 플러그인을 설정해야 합니다.
이를 위해, 공유 모듈의 `build.gradle.kts` 파일 맨 처음에 있는 기존 `plugins {}` 블록에 다음 줄을 추가하세요:

```kotlin
plugins {
    // ...
    kotlin("plugin.serialization") version "%kotlinVersion%"
}
```

### Ktor

공유 모듈의 공통 소스 세트에 코어 의존성(`ktor-client-core`)을 추가해야 합니다.
또한 다음 지원 의존성도 추가해야 합니다:

* 특정 형식으로 콘텐츠를 직렬화하고 역직렬화할 수 있는 `ContentNegotiation` 기능(`ktor-client-content-negotiation`)을 추가하세요.
* Ktor가 JSON 형식을 사용하고 `kotlinx.serialization`을 직렬화 라이브러리로 사용하도록 지시하는 `ktor-serialization-kotlinx-json` 의존성을 추가하세요. Ktor는 응답을 받을 때 JSON 데이터를 예상하고 이를 데이터 클래스(data class)로 역직렬화합니다.
* 플랫폼 소스 세트(`ktor-client-android`, `ktor-client-darwin`)에 해당 아티팩트(artifact)에 대한 의존성을 추가하여 플랫폼 엔진(engine)을 제공하세요.

```kotlin
kotlin {
    // ...
    val ktorVersion = "%ktorVersion%"

    sourceSets {
        commonMain.dependencies {
            // ...

            implementation("io.ktor:ktor-client-core:$ktorVersion")
            implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
            implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
        }
        androidMain.dependencies {
            implementation("io.ktor:ktor-client-android:$ktorVersion")
        }
        iosMain.dependencies {
            implementation("io.ktor:ktor-client-darwin:$ktorVersion")
        }
    }
}
```

**Sync Gradle Changes** 버튼을 클릭하여 Gradle 파일을 동기화하세요.

## API 요청 생성하기

데이터를 가져오려면 [SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)가 필요하며, `v4/launches` 엔드포인트(endpoint)에서 모든 발사 목록을 가져오는 단일 메서드를 사용할 것입니다.

### 데이터 모델 추가하기

`shared/src/commonMain/kotlin/.../greetingkmp` 디렉토리에 새로운 `RocketLaunch.kt` 파일을 생성하고 SpaceX API에서 데이터를 저장하는 데이터 클래스를 추가하세요:

```kotlin
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RocketLaunch (
    @SerialName("flight_number")
    val flightNumber: Int,
    @SerialName("name")
    val missionName: String,
    @SerialName("date_utc")
    val launchDateUTC: String,
    @SerialName("success")
    val launchSuccess: Boolean?,
)
```

* `RocketLaunch` 클래스는 `@Serializable` 어노테이션으로 표시되어 `kotlinx.serialization` 플러그인이 자동으로 기본 직렬화기(serializer)를 생성할 수 있도록 합니다.
* `@SerialName` 어노테이션을 사용하면 필드 이름을 재정의할 수 있어 데이터 클래스에 더 읽기 쉬운 이름으로 속성(property)을 선언할 수 있습니다.

### HTTP 클라이언트 연결하기

1.  `shared/src/commonMain/kotlin/.../greetingkmp` 디렉토리에 새로운 `RocketComponent` 클래스를 생성합니다.
2.  HTTP GET 요청을 통해 로켓 발사 정보를 가져올 `httpClient` 속성을 추가합니다:

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.plugins.contentnegotiation.*
    import io.ktor.serialization.kotlinx.json.*
    import kotlinx.serialization.json.Json
    
    class RocketComponent {
        private val httpClient = HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true
                })
            }
        }
    }
    ```

   * [ContentNegotiation Ktor 플러그인](https://ktor.io/docs/serialization-client.html#register_json)과 JSON 직렬화기는 GET 요청의 결과를 역직렬화합니다.
   * 여기에서 JSON 직렬화기는 `prettyPrint` 속성으로 JSON을 더 읽기 쉽게 출력하도록 구성되어 있습니다. `isLenient`를 사용하여 잘못된 형식의 JSON을 읽을 때 더 유연하며, `ignoreUnknownKeys`를 사용하여 로켓 발사 모델에 선언되지 않은 키는 무시합니다.

3.  `RocketComponent`에 `getDateOfLastSuccessfulLaunch()` 일시 중단 함수(suspending function)를 추가합니다:

   ```kotlin
   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
       
       }
   }
   ```

4.  로켓 발사에 대한 정보를 가져오기 위해 `httpClient.get()` 함수를 호출합니다:

   ```kotlin
   import io.ktor.client.request.*
   import io.ktor.client.call.*

   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
           val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
       }
   }
   ```

   * `httpClient.get()` 역시 일시 중단 함수입니다. 스레드를 차단하지 않고 네트워크를 통해 비동기적으로 데이터를 가져와야 하기 때문입니다.
   * 일시 중단 함수는 코루틴(coroutines)이나 다른 일시 중단 함수에서만 호출할 수 있습니다. 이것이 `getDateOfLastSuccessfulLaunch()`가 `suspend` 키워드로 표시된 이유입니다. 네트워크 요청은 HTTP 클라이언트의 스레드 풀(thread pool)에서 실행됩니다.

5.  목록에서 마지막 성공적인 발사를 찾기 위해 함수를 다시 업데이트합니다:

   ```kotlin
   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
           val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
           val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
       }
   }
   ```

   로켓 발사 목록은 오래된 순서부터 최신 순서로 정렬됩니다.

6.  발사 날짜를 UTC에서 현재 지역 날짜로 변환하고 출력을 포맷합니다:

   ```kotlin
   import kotlinx.datetime.TimeZone
   import kotlinx.datetime.toLocalDateTime
   import kotlin.time.Instant

   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
           val rockets: List<RocketLaunch> =
               httpClient.get("https://api.spacexdata.com/v4/launches").body()
           val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
           val date = Instant.parse(lastSuccessLaunch.launchDateUTC)
               .toLocalDateTime(TimeZone.currentSystemDefault())
       
           return "${date.month} ${date.day}, ${date.year}"
       }
   }
   ```

   날짜는 "MMMM DD, YYYY" 형식으로 표시됩니다(예: OCTOBER 5, 2022).

7.  `getDateOfLastSuccessfulLaunch()` 함수를 사용하여 메시지를 생성할 또 다른 일시 중단 함수인 `launchPhrase()`를 추가합니다:

    ```kotlin
    class RocketComponent {
        // ...
    
        suspend fun launchPhrase(): String =
            try {
                "The last successful launch was on ${getDateOfLastSuccessfulLaunch()} 🚀"
            } catch (e: Exception) {
                println("Exception during getting the date of the last successful launch $e")
                "Error occurred"
            }
    }
    ```

### Flow 생성하기

일시 중단 함수 대신 Flow를 사용할 수 있습니다. Flow는 일시 중단 함수가 단일 값을 반환하는 대신 일련의 값을 내보냅니다.

1.  `shared/src/commonMain/kotlin` 디렉토리에서 `Greeting.kt` 파일을 엽니다.
2.  `Greeting` 클래스에 `rocketComponent` 속성을 추가합니다. 이 속성은 마지막 성공적인 발사 날짜를 포함하는 메시지를 저장합니다:

   ```kotlin
   private val rocketComponent = RocketComponent()
   ```

3.  `greet()` 함수를 `Flow`를 반환하도록 변경합니다:

    ```kotlin
    import kotlinx.coroutines.delay
    import kotlinx.coroutines.flow.Flow
    import kotlinx.coroutines.flow.flow
    import kotlin.time.Duration.Companion.seconds
    
    class Greeting {
        // ...
        fun greet(): Flow<String> = flow {
            emit(if (Random.nextBoolean()) "Hi!" else "Hello!")
            delay(1.seconds)
            emit("Guess what this is! > ${platform.name.reversed()}")
            delay(1.seconds)
            emit(daysPhrase())
            emit(rocketComponent.launchPhrase())
        }
    }
    ```

   * 여기서는 모든 문장을 래핑하는 `flow()` 빌더 함수로 `Flow`가 생성됩니다.
   * `Flow`는 각 내보내기 사이에 1초의 지연 시간을 두고 문자열을 내보냅니다. 마지막 요소는 네트워크 응답이 반환된 후에만 내보내지므로 정확한 지연 시간은 네트워크에 따라 달라집니다.

### 인터넷 접근 권한 추가하기

인터넷에 접근하려면 Android 애플리케이션에 적절한 권한이 필요합니다. 모든 네트워크 요청이 공유 모듈에서 이루어지므로, 해당 매니페스트(manifest)에 인터넷 접근 권한을 추가하는 것이 합리적입니다.

`composeApp/src/androidMain/AndroidManifest.xml` 파일을 접근 권한으로 업데이트하세요:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    ...
</manifest>
```

`greet()` 함수의 반환 타입을 `Flow`로 변경하여 공유 모듈의 API를 이미 업데이트했습니다.
이제 `greet()` 함수 호출 결과를 적절히 처리할 수 있도록 프로젝트의 네이티브(native) 부분을 업데이트해야 합니다.

## 네이티브 Android UI 업데이트하기

공유 모듈과 Android 애플리케이션 모두 Kotlin으로 작성되었으므로 Android에서 공유 코드를 사용하는 것은 간단합니다.

### 뷰 모델 도입하기

이제 애플리케이션이 더욱 복잡해짐에 따라, UI를 구현하는 `App()` 함수를 호출하는 [Android 액티비티](https://developer.android.com/guide/components/activities/intro-activities)인 `MainActivity`에 뷰 모델(view model)을 도입할 때입니다. 뷰 모델은 액티비티의 데이터를 관리하며 액티비티가 생명 주기 변경을 겪을 때 사라지지 않습니다.

1.  `composeApp/build.gradle.kts` 파일에 다음 의존성을 추가합니다:

    ```kotlin
    androidMain.dependencies {
        // ...
        implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2")
        implementation("androidx.lifecycle:lifecycle-runtime-compose:2.6.2")
        implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.6.2")
    }
    ```

2.  `composeApp/src/androidMain/kotlin/com/jetbrains/greeting/greetingkmp` 디렉토리에 새로운 `MainViewModel` Kotlin 클래스를 생성합니다:

    ```kotlin
    import androidx.lifecycle.ViewModel
    
    class MainViewModel : ViewModel() {
        // ...
    }
    ```

   이 클래스는 Android의 `ViewModel` 클래스를 확장하며, 생명 주기 및 구성 변경에 대한 올바른 동작을 보장합니다.

3.  `StateFlow` 타입의 `greetingList` 값과 해당 백업 속성(backing property)을 생성합니다:

    ```kotlin
    import kotlinx.coroutines.flow.MutableStateFlow
    import kotlinx.coroutines.flow.StateFlow
    
    class MainViewModel : ViewModel() {
        private val _greetingList = MutableStateFlow<List<String>>(listOf())
        val greetingList: StateFlow<List<String>> get() = _greetingList
    }
    ```

   * 여기서 `StateFlow`는 `Flow` 인터페이스를 확장하지만 단일 값 또는 상태를 가집니다.
   * private 백업 속성 `_greetingList`는 이 클래스의 클라이언트만 읽기 전용 `greetingList` 속성에 접근할 수 있도록 보장합니다.

4.  뷰 모델의 `init` 함수에서 `Greeting().greet()` flow에서 모든 문자열을 수집합니다:

    ```kotlin
   import androidx.lifecycle.viewModelScope
   import kotlinx.coroutines.launch
   
   class MainViewModel : ViewModel() {
       private val _greetingList = MutableStateFlow<List<String>>(listOf())
       val greetingList: StateFlow<List<String>> get() = _greetingList
       
       init {
           viewModelScope.launch {
               Greeting().greet().collect { phrase ->
                    //...
               }
           }
       }
    }
    ```

   `collect()` 함수는 일시 중단되므로, 뷰 모델의 스코프(scope) 내에서 `launch` 코루틴이 사용됩니다.
   이는 `launch` 코루틴이 뷰 모델 생명 주기의 올바른 단계에서만 실행됨을 의미합니다.

5.  `collect` 트레일링 람다(trailing lambda) 내에서, 수집된 `phrase`를 `list`의 문구 목록에 추가하도록 `_greetingList`의 값을 업데이트합니다:

    ```kotlin
    import kotlinx.coroutines.flow.update
   
    class MainViewModel : ViewModel() {
        //...
   
        init {
            viewModelScope.launch {
                Greeting().greet().collect { phrase ->
                    _greetingList.update { list -> list + phrase }
                }
            }
        }
    }
    ```

   `update()` 함수는 값을 자동으로 업데이트합니다.

### 뷰 모델의 Flow 사용하기

1.  `composeApp/src/androidMain/kotlin`에서 `App.kt` 파일을 열고 이전 구현을 대체하여 업데이트합니다:

    ```kotlin
    import androidx.lifecycle.compose.collectAsStateWithLifecycle
    import androidx.compose.runtime.getValue
    import androidx.lifecycle.viewmodel.compose.viewModel
    
    @Composable
    fun App(mainViewModel: MainViewModel = viewModel()) {
        MaterialTheme {
            val greetings by mainViewModel.greetingList.collectAsStateWithLifecycle()
    
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                greetings.forEach { greeting ->
                    Text(greeting)
                    HorizontalDivider()
                }
            }
        }
    }
    ```

   * `collectAsStateWithLifecycle()` 함수는 `greetingList`에서 호출되어 ViewModel의 flow에서 값을 수집하고 생명 주기를 인식하는 방식으로 컴포저블 상태(composable state)로 나타냅니다.
   * 새로운 flow가 생성될 때, 컴포즈 상태가 변경되어 구분선으로 분리되어 수직으로 배열된 인사말 문구와 함께 스크롤 가능한 `Column`이 표시됩니다.

2.  결과를 보려면 **composeApp** 구성을 다시 실행하세요:

   ![Final results](multiplatform-mobile-upgrade-android.png){width=300}

## 네이티브 iOS UI 업데이트하기

프로젝트의 iOS 부분에서는 모든 비즈니스 로직을 포함하는 공유 모듈에 UI를 연결하기 위해 다시 [모델-뷰-뷰모델(Model–view–viewmodel)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) 패턴을 사용할 것입니다.

이 모듈은 `import Shared` 선언을 통해 `ContentView.swift` 파일에 이미 임포트(import)되어 있습니다.

### ViewModel 도입하기

`iosApp/ContentView.swift`에서 `ContentView`를 위한 `ViewModel` 클래스를 생성합니다. 이 클래스는 데이터를 준비하고 관리합니다. 동시성(concurrency)을 지원하기 위해 `task()` 호출 내에서 `startObserving()` 함수를 호출합니다:

```swift
import SwiftUI
import Shared

struct ContentView: View {
    @ObservedObject private(set) var viewModel: ViewModel

    var body: some View {
        ListView(phrases: viewModel.greetings)
            .task { await self.viewModel.startObserving() }
    }
}

extension ContentView {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var greetings: Array<String> = []
        
        func startObserving() {
            // ...
        }
    }
}

struct ListView: View {
    let phrases: Array<String>

    var body: some View {
        List(phrases, id: \.self) {
            Text($0)
        }
    }
}
```

* `ViewModel`은 `ContentView`의 확장으로 선언됩니다. 이들은 밀접하게 연결되어 있기 때문입니다.
* `ViewModel`은 `String` 문구 배열인 `greetings` 속성을 가집니다.
  SwiftUI는 ViewModel(`ContentView.ViewModel`)을 뷰(`ContentView`)와 연결합니다.
* `ContentView.ViewModel`은 `ObservableObject`로 선언됩니다.
* `@Published` 래퍼(wrapper)는 `greetings` 속성에 사용됩니다.
* `@ObservedObject` 속성 래퍼는 ViewModel을 구독하는 데 사용됩니다.

이 ViewModel은 이 속성이 변경될 때마다 신호를 내보냅니다.
이제 `startObserving()` 함수를 구현하여 flow를 소비해야 합니다.

### iOS에서 flow를 소비할 라이브러리 선택하기

이 튜토리얼에서는 iOS에서 flow를 사용하는 데 도움이 되는 [SKIE](https://skie.touchlab.co/) 또는 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines) 라이브러리를 사용할 수 있습니다.
둘 다 Kotlin/Native 컴파일러가 아직 기본적으로 제공하지 않는 flow의 취소(cancellation)와 제네릭스(generics)를 지원하는 오픈 소스 솔루션입니다:

* SKIE 라이브러리는 Kotlin 컴파일러가 생성하는 Objective-C API를 확장합니다. SKIE는 flow를 Swift의 `AsyncSequence`와 동등한 형태로 변환합니다. SKIE는 스레드 제한 없이 Swift의 `async`/`await`를 직접 지원하며, 자동 양방향 취소 기능을 제공합니다(Combine 및 RxSwift는 어댑터(adapter)가 필요함). SKIE는 Kotlin에서 Swift 친화적인 API를 생성하기 위한 다른 기능들도 제공하며, 다양한 Kotlin 타입을 Swift 동등 타입으로 브리징(bridging)하는 기능도 포함합니다. 또한 iOS 프로젝트에 추가 의존성을 필요로 하지 않습니다.
* KMP-NativeCoroutines 라이브러리는 필요한 래퍼(wrapper)를 생성하여 iOS에서 일시 중단 함수(suspending functions)와 flow를 소비하는 데 도움을 줍니다.
  KMP-NativeCoroutines는 Swift의 `async`/`await` 기능뿐만 아니라 Combine 및 RxSwift도 지원합니다.
  KMP-NativeCoroutines를 사용하려면 iOS 프로젝트에 SPM 또는 CocoaPod 의존성을 추가해야 합니다.

### 옵션 1. KMP-NativeCoroutines 설정하기 {initial-collapse-state="collapsed" collapsible="true"}

> 라이브러리의 최신 버전을 사용하는 것이 좋습니다.
> 플러그인의 더 새로운 버전이 사용 가능한지 확인하려면 [KMP-NativeCoroutines 저장소](https://github.com/rickclephas/KMP-NativeCoroutines/releases)를 확인하세요.
>
{style="note"}

1.  프로젝트의 루트 `build.gradle.kts` 파일( **shared/build.gradle.kts** 파일 아님)에서 `plugins {}` 블록에 KSP(Kotlin Symbol Processor) 및 KMP-NativeCoroutines 플러그인을 추가합니다:

    ```kotlin
    plugins {
        // ...
        id("com.google.devtools.ksp").version("%kspVersion%").apply(false)
        id("com.rickclephas.kmp.nativecoroutines").version("%kmpncVersion%").apply(false)
    }
    ```

2.  `shared/build.gradle.kts` 파일에 KMP-NativeCoroutines 플러그인을 추가합니다:

    ```kotlin
    plugins {
        // ...
        id("com.google.devtools.ksp")
        id("com.rickclephas.kmp.nativecoroutines")
    }
    ```

3.  또한 `shared/build.gradle.kts` 파일에서 실험적인 `@ObjCName` 어노테이션을 선택합니다:

    ```kotlin
    kotlin {
        // ...
        sourceSets{
            all {
                languageSettings {
                    optIn("kotlin.experimental.ExperimentalObjCName")
                    optIn("kotlin.time.ExperimentalTime")
                }
            }
            // ...
        }
    }
    ```

4.  **Sync Gradle Changes** 버튼을 클릭하여 Gradle 파일을 동기화합니다.

#### KMP-NativeCoroutines로 flow 표시하기

1.  `shared/src/commonMain/kotlin` 디렉토리에서 `Greeting.kt` 파일을 엽니다.
2.  `greet()` 함수에 `@NativeCoroutines` 어노테이션을 추가합니다. 이렇게 하면 플러그인이 iOS에서 올바른 flow 처리를 지원하는 코드를 생성하게 됩니다:

   ```kotlin
    import com.rickclephas.kmp.nativecoroutines.NativeCoroutines
    
    class Greeting {
        // ...
       
        @NativeCoroutines
        fun greet(): Flow<String> = flow {
            // ...
        }
    }
    ```

#### Xcode에서 SPM을 사용하여 라이브러리 임포트하기

1.  **File** | **Open Project in Xcode**로 이동합니다.
2.  Xcode의 왼쪽 메뉴에서 `iosApp` 프로젝트를 마우스 오른쪽 버튼으로 클릭하고 **Add Package Dependencies**를 선택합니다.
3.  검색 바에 패키지 이름을 입력합니다:

     ```none
    https://github.com/rickclephas/KMP-NativeCoroutines.git
    ```

   ![Importing KMP-NativeCoroutines](multiplatform-import-kmp-nativecoroutines.png){width=700}

4.  **Dependency Rule** 드롭다운에서 **Exact Version** 항목을 선택하고 옆 필드에 `%kmpncVersion%` 버전을 입력합니다.
5.  **Add Package** 버튼을 클릭합니다: Xcode는 GitHub에서 패키지를 가져와 패키지 제품을 선택하는 다른 창을 엽니다.
6.  표시된 대로 "KMPNativeCoroutinesAsync"와 "KMPNativeCoroutinesCore"를 앱에 추가한 다음 **Add Package**를 클릭합니다:

   ![Add KMP-NativeCoroutines packages](multiplatform-add-package.png){width=500}

이렇게 하면 `async/await` 메커니즘과 함께 작동하는 데 필요한 KMP-NativeCoroutines 패키지의 부분이 설치됩니다.

#### KMP-NativeCoroutines 라이브러리를 사용하여 flow 소비하기

1.  `iosApp/ContentView.swift`에서 `startObserving()` 함수를 업데이트하여 `Greeting().greet()` 함수에 KMP-NativeCoroutine의 `asyncSequence()` 함수를 사용하여 flow를 소비합니다:

    ```Swift
    func startObserving() async {
        do {
            let sequence = asyncSequence(for: Greeting().greet())
            for try await phrase in sequence {
                self.greetings.append(phrase)
            }
        } catch {
            print("Failed with error: \(error)")
        }
    }
    ```

   여기서 루프와 `await` 메커니즘은 flow를 반복하고 flow가 값을 내보낼 때마다 `greetings` 속성을 업데이트하는 데 사용됩니다.

2.  `ViewModel`이 `@MainActor` 어노테이션으로 표시되어 있는지 확인하세요. 이 어노테이션은 `ViewModel` 내의 모든 비동기 작업이 Kotlin/Native 요구 사항을 준수하기 위해 메인 스레드에서 실행되도록 보장합니다:

    ```Swift
    // ...
    import KMPNativeCoroutinesAsync
    import KMPNativeCoroutinesCore
    
    // ...
    extension ContentView {
        @MainActor
        class ViewModel: ObservableObject {
            @Published var greetings: Array<String> = []
    
            func startObserving() async {
                do {
                    let sequence = asyncSequence(for: Greeting().greet())
                    for try await phrase in sequence {
                        self.greetings.append(phrase)
                    }
                } catch {
                    print("Failed with error: \(error)")
                }
            }
        }
    }
    ```

### 옵션 2. SKIE 설정하기 {initial-collapse-state="collapsed" collapsible="true"}

라이브러리를 설정하려면 `shared/build.gradle.kts`에 SKIE 플러그인을 지정하고 **Sync Gradle Changes** 버튼을 클릭합니다.

```kotlin
plugins {
   id("co.touchlab.skie") version "%skieVersion%"
}
```

#### SKIE를 사용하여 flow 소비하기

`Greeting().greet()` flow를 반복하고 flow가 값을 내보낼 때마다 `greetings` 속성을 업데이트하기 위해 루프와 `await` 메커니즘을 사용할 것입니다.

`ViewModel`이 `@MainActor` 어노테이션으로 표시되어 있는지 확인하세요.
이 어노테이션은 `ViewModel` 내의 모든 비동기 작업이 Kotlin/Native 요구 사항을 준수하기 위해 메인 스레드에서 실행되도록 보장합니다:

```Swift
// ...
extension ContentView {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var greetings: [String] = []

        func startObserving() async {
            for await phrase in Greeting().greet() {
                self.greetings.append(phrase)
            }
        }
    }
}
```

### ViewModel을 소비하고 iOS 앱 실행하기

`iosApp/iOSApp.swift`에서 앱의 진입점(entry point)을 업데이트합니다:

```swift
@main
struct iOSApp: App {
   var body: some Scene {
       WindowGroup {
           ContentView(viewModel: ContentView.ViewModel())
       }
   }
}
```

IntelliJ IDEA에서 **iosApp** 구성을 실행하여 앱의 로직이 동기화되었는지 확인합니다:

![Final results](multiplatform-mobile-upgrade-ios.png){width=300}

> 서로 다른 코루틴 솔루션을 사용하는 프로젝트의 최종 상태는 GitHub 저장소의 두 브랜치에서 찾을 수 있습니다.
> * [`main`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main) 브랜치에는 KMP-NativeCoroutines 구현이 포함되어 있습니다.
> * [`main-skie`](https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main-skie) 브랜치에는 SKIE 구현이 포함되어 있습니다.
>
{style="note"}

## 다음 단계

튜토리얼의 마지막 부분에서는 프로젝트를 마무리하고 다음 단계를 알아봅니다.

**[다음 부분으로 진행하기](multiplatform-wrap-up.md)**

### 더 보기

* [일시 중단 함수 구성(composition)에 대한 다양한 접근 방식](https://kotlinlang.org/docs/composing-suspending-functions.html)을 살펴보세요.
* [Objective-C 프레임워크 및 라이브러리와의 상호 운용성(interoperability)](https://kotlinlang.org/docs/native-objc-interop.html)에 대해 자세히 알아보세요.
* [네트워킹 및 데이터 저장소](multiplatform-ktor-sqldelight.md)에 대한 이 튜토리얼을 완료하세요.

## 도움 받기

* **Kotlin Slack**. [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 및 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
* **Kotlin 이슈 트래커**. [새로운 이슈 보고하기](https://youtrack.jetbrains.com/newIssue?project=KT).