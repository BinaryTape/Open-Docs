[//]: # (title: 공통 ViewModel)

UI를 구축하는 Android [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 접근 방식은 Compose Multiplatform를 사용하여 공통 코드에서 구현할 수 있습니다.

## 프로젝트에 공통 ViewModel 추가하기

멀티플랫폼 `ViewModel` 구현을 사용하려면 `commonMain` 소스 세트에 다음 의존성을 추가하세요:

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose:%org.jetbrains.androidx.lifecycle%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose:%org.jetbrains.androidx.lifecycle%"}

## 공통 코드에서 ViewModel 사용하기

Compose Multiplatform는 공통 `ViewModelStoreOwner` 인터페이스를 구현하므로, 일반적으로 공통 코드에서 `ViewModel` 클래스를 사용하는 것은 Android의 모범 사례와 크게 다르지 않습니다.

[내비게이션 예제](https://github.com/JetBrains/compose-multiplatform/tree/0e38f58b42d23ff6d0ad30b119d34fa1cd6ccedb/examples/nav_cupcake)를 사용한 예시입니다:

1.  ViewModel 클래스 선언:

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

class OrderViewModel : ViewModel() {
   private val _uiState = MutableStateFlow(OrderUiState(pickupOptions = pickupOptions()))
   val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()
   // ...
}
```

2.  컴포저블 함수에 ViewModel 추가:

```kotlin
@Composable
fun CupcakeApp(
   viewModel: OrderViewModel = viewModel { OrderViewModel() },
) {
   // ...
}
```

> ViewModel에서 코루틴을 실행할 때, `ViewModel.viewModelScope` 값은 `Dispatchers.Main.immediate` 값에 연결되어 있으며, 이 값은 기본적으로 데스크톱에서 사용하지 못할 수 있다는 점을 기억하세요. ViewModel 코루틴이 Compose Multiplatform에서 올바르게 작동하려면 프로젝트에 `kotlinx-coroutines-swing` 의존성을 추가하세요. 자세한 내용은 [`Dispatchers.Main` 문서](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)를 참조하세요.
> 
{style="tip"}

비 JVM 플랫폼에서는 타입 리플렉션을 사용하여 객체를 인스턴스화할 수 없습니다.
따라서 공통 코드에서는 매개변수 없이 `viewModel()` 함수를 호출할 수 없습니다. `ViewModel` 인스턴스를 생성할 때마다 최소한 초기화 람다를 인수로 제공해야 합니다.

초기화 람다만 제공하는 경우, 라이브러리는 내부적으로 기본 팩토리를 생성합니다.
하지만 [Jetpack Compose](https://developer.android.com/topic/libraries/architecture/viewmodel#jetpack-compose)에서와 마찬가지로, 사용자 정의 팩토리를 구현하고 공통 `viewModel(...)` 함수의 더 명시적인 버전을 호출할 수 있습니다.