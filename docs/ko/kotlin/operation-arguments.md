[//]: # (title: 연산 인자)

이 튜토리얼에서는 연산 인자를 구성하는 방법을 배웁니다.

아래의 간단한 `MultiMap` 구현을 살펴보세요. 이 구현은 `ConcurrentHashMap`을 기반으로 하며, 내부적으로 값의 목록을 저장합니다:

```kotlin
import java.util.concurrent.*

class MultiMap<K, V> {
    private val map = ConcurrentHashMap<K, List<V>>()
   
    // 지정된 키와 연결된 값 목록을 유지합니다.
    fun add(key: K, value: V) {
        val list = map[key]
        if (list == null) {
            map[key] = listOf(value)
        } else {
            map[key] = list + value
        }
    }

    fun get(key: K): List<V> = map[key] ?: emptyList()
}
```

이 `MultiMap` 구현은 선형화 가능한가요 (linearizable)? 그렇지 않다면, 작은 범위의 키에 접근할 때 잘못된 인터리빙 (interleaving)이 감지될 가능성이 더 높으며, 이로 인해 동일한 키를 동시에 처리할 가능성이 증가합니다.

이를 위해 `key: Int` 파라미터에 대한 제너레이터를 구성합니다:

1.  `@Param` 어노테이션을 선언합니다.
2.  정수 제너레이터 클래스를 지정합니다: `@Param(gen = IntGen::class)`.
    Lincheck는 거의 모든 기본 타입과 문자열에 대한 무작위 파라미터 제너레이터를 별도의 설정 없이 (out of the box) 지원합니다.
3.  문자열 설정 `@Param(conf = "1:2")`으로 생성될 값의 범위를 정의합니다.
4.  여러 연산에서 공유할 파라미터 구성 이름 (`@Param(name = "key")`)을 지정합니다.

    아래는 `[1..2]` 범위의 `add(key, value)` 및 `get(key)` 연산에 대한 키를 생성하는 `MultiMap`의 스트레스 테스트입니다: 
    
    ```kotlin
    import java.util.concurrent.*
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.paramgen.*
    import org.jetbrains.kotlinx.lincheck.strategy.stress.*
    import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
    import org.junit.*
    
    class MultiMap<K, V> {
        private val map = ConcurrentHashMap<K, List<V>>()
    
        // 지정된 키와 연결된 값 목록을 유지합니다.
        fun add(key: K, value: V) {
            val list = map[key]
            if (list == null) {
                map[key] = listOf(value)
            } else {
                map[key] = list + value
            }
        }
    
        fun get(key: K): List<V> = map[key] ?: emptyList()
    }
    
    @Param(name = "key", gen = IntGen::class, conf = "1:2")
    class MultiMapTest {
        private val map = MultiMap<Int, Int>()
    
        @Operation
        fun add(@Param(name = "key") key: Int, value: Int) = map.add(key, value)
    
        @Operation
        fun get(@Param(name = "key") key: Int) = map.get(key)
    
        @Test
        fun stressTest() = StressOptions().check(this::class)
    
        @Test
        fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
    }
    ```

5.  `stressTest()`를 실행하고 다음 출력을 확인합니다:

    ```text
    = Invalid execution results =
    | ---------------------------------- |
    |    Thread 1     |     Thread 2     |
    | ---------------------------------- |
    | add(2, 0): void | add(2, -1): void |
    | ---------------------------------- |
    | get(2): [0]     |                  |
    | ---------------------------------- |
    ```
    
6.  마지막으로 `modelCheckingTest()`를 실행합니다. 다음 출력과 함께 실패합니다:

    ```text
    = Invalid execution results =
    | ---------------------------------- |
    |    Thread 1     |     Thread 2     |
    | ---------------------------------- |
    | add(2, 0): void | add(2, -1): void |
    | ---------------------------------- |
    | get(2): [-1]    |                  |
    | ---------------------------------- |
    
    ---
    수평선 | ----- | 위에 있는 모든 연산은 선 아래에 있는 연산보다 먼저 발생합니다.
    ---
    
    다음 인터리빙이 오류를 발생시킵니다:
    | ---------------------------------------------------------------------- |
    |    Thread 1     |                       Thread 2                       |
    | ---------------------------------------------------------------------- |
    |                 | add(2, -1)                                           |
    |                 |   add(2,-1) at MultiMapTest.add(MultiMap.kt:31)      |
    |                 |     get(2): null at MultiMap.add(MultiMap.kt:15)     |
    |                 |     switch                                           |
    | add(2, 0): void |                                                      |
    |                 |     put(2,[-1]): [0] at MultiMap.add(MultiMap.kt:17) |
    |                 |   result: void                                       |
    | ---------------------------------------------------------------------- |
    ```

키의 범위가 작기 때문에 Lincheck는 경쟁 조건 (race condition)을 빠르게 드러냅니다. 동일한 키로 두 값이 동시에 추가될 때, 한 값은 덮어쓰여지고 손실될 수 있습니다.

## 다음 단계

단일 생산자-단일 소비자 큐 (single-producer single-consumer queues)와 같이 [실행 시 접근 제약 조건](constraints.md)을 설정하는 데이터 구조를 테스트하는 방법을 배웁니다.