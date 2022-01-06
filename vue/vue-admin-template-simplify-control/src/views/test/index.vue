<template>
  <div class="hello">
    <div class="out" v-for="(team,tindex) in teamDataArr" :key="tindex">
      <div
        class="top"
        v-for="(item,cindex) in team.children"
        :key="cindex"
        :data-id="tindex+'-'+cindex"
        :class="{on : !item.isMain}"
      >
        <div class="oneout">
          <div
            v-for="(one,oindex) in item.children"
            :key="oindex"
            :data-id="tindex+'-'+cindex+'-'+oindex"
            class="one"
          >
            <div class="twoout">
              <div
                v-for="(two,pindex) in one.children"
                :key="pindex"
                :data-id="tindex+'-'+cindex+'-'+oindex+'-'+pindex"
                class="two"
                draggable="true"
                @dragstart="onDragstart($event)"
                @dragend="onDragend($event)"
                @dragover="onDragover($event)"
                @drop="onDrop($event)"
              >
                <div class="threeout">
                  <div
                    v-for="(three,qindex) in two.children"
                    :key="qindex"
                    :data-id="tindex+'-'+cindex+'-'+oindex+'-'+pindex+'-'+qindex"
                    class="three"
                  >
                    <div class="threecont">{{three.name + '第四层'}}</div>
                  </div>
                </div>
                <div class="twocont">{{two.name + '第三层'}}</div>
              </div>
            </div>

            <div class="onecont">{{one.name + '第二层'}}</div>
          </div>
        </div>
        <div class="topcont">{{item.name + '第一层'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      startExchangeIndex: "",
      endExchangeIndex: "",
      teamDataArr: [
        {
          teamName: "A队",
          children: [
            {
              id: 11,
              name: "A队",
              mobile: "A队",
              isMain: true,
              children: [
                {
                  id: 11,
                  name: "A队",
                  mobile: "A队",
                  children: [
                    {
                      id: 111,
                      name: "A队",
                      mobile: "A队",
                      children: [
                        {
                          id: 111,
                          name: "A队",
                          mobile: "A队"
                        },
                        {
                          id: 211,
                          name: "A队",
                          mobile: "A队"
                        }
                      ]
                    },
                    {
                      id: 211,
                      name: "A队",
                      mobile: "A队",
                      children: [
                        {
                          id: 111,
                          name: "A队",
                          mobile: "A队"
                        },
                        {
                          id: 211,
                          name: "A队",
                          mobile: "A队"
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 211,
                  name: "A队",
                  mobile: "A队",
                  children: [
                    {
                      id: 111,
                      name: "A队",
                      mobile: "A队",
                      children: [
                        {
                          id: 111,
                          name: "A队",
                          mobile: "A队"
                        },
                        {
                          id: 211,
                          name: "A队",
                          mobile: "A队"
                        }
                      ]
                    },
                    {
                      id: 211,
                      name: "A队",
                      mobile: "A队",
                      children: [
                        {
                          id: 111,
                          name: "A队",
                          mobile: "A队"
                        },
                        {
                          id: 211,
                          name: "A队",
                          mobile: "A队"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          teamName: "B队",
          children: [
            {
              id: 6,
              name: "B队",
              mobile: "B队",
              isMain: false,
              children: [
                {
                  id: 1,
                  name: "B队",
                  mobile: "B队",
                  children: [
                    {
                      id: 111,
                      name: "B队",
                      mobile: "B队",
                      children: [
                        {
                          id: 111,
                          name: "B队",
                          mobile: "B队"
                        },
                        {
                          id: 211,
                          name: "B队",
                          mobile: "B队"
                        }
                      ]
                    },
                    {
                      id: 211,
                      name: "B队",
                      mobile: "B队",
                      children: [
                        {
                          id: 111,
                          name: "B队",
                          mobile: "B队"
                        },
                        {
                          id: 211,
                          name: "B队",
                          mobile: "B队"
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 2,
                  name: "B队",
                  mobile: "B队",
                  children: [
                    {
                      id: 111,
                      name: "B队",
                      mobile: "B队",
                      children: [
                        {
                          id: 111,
                          name: "B队",
                          mobile: "B队"
                        },
                        {
                          id: 211,
                          name: "B队",
                          mobile: "B队"
                        }
                      ]
                    },
                    {
                      id: 211,
                      name: "B队",
                      mobile: "B队",
                      children: [
                        {
                          id: 111,
                          name: "B队",
                          mobile: "B队"
                        },
                        {
                          id: 211,
                          name: "B队",
                          mobile: "B队"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    onDragstart(event) {
      // event.target 都返回源元素
      this.startExchangeIndex = event.target.getAttribute("data-id");
    },
    onDragend(event) {
      let startTeamIndex,
        startMemberIndex,
        startOneIndex,
        startTwoIndex,
        startThreeIndex,
        endTeamIndex,
        endMemberIndex,
        endOneIndex,
        endTwoIndex,
        endThreeIndex;
      if (parseInt(this.startExchangeIndex.split("-").length) >= 2) {
        startTeamIndex = parseInt(this.startExchangeIndex.split("-")[0]);
        startMemberIndex = parseInt(this.startExchangeIndex.split("-")[1]);
        endTeamIndex = parseInt(this.endExchangeIndex.split("-")[0]);
        endMemberIndex = parseInt(this.endExchangeIndex.split("-")[1]);
      }
      if (parseInt(this.startExchangeIndex.split("-").length) >= 3) {
        startOneIndex = parseInt(this.startExchangeIndex.split("-")[2]);
        endOneIndex = parseInt(this.endExchangeIndex.split("-")[2]);
      }
      if (parseInt(this.startExchangeIndex.split("-").length) >= 4) {
        startTwoIndex = parseInt(this.startExchangeIndex.split("-")[3]);
        endTwoIndex = parseInt(this.endExchangeIndex.split("-")[3]);
      }
      if (parseInt(this.startExchangeIndex.split("-").length) >= 5) {
        startThreeIndex = parseInt(this.startExchangeIndex.split("-")[4]);
        endThreeIndex = parseInt(this.endExchangeIndex.split("-")[4]);
      }

      // 数据交换
      if (parseInt(this.startExchangeIndex.split("-").length) == 5) {
        let item1 = this.teamDataArr[startTeamIndex].children[startMemberIndex]
          .children[startOneIndex].children[startTwoIndex].children[
          startThreeIndex
        ];

        let item2 = this.teamDataArr[endTeamIndex].children[endMemberIndex]
          .children[endOneIndex].children[endTwoIndex].children[endThreeIndex];

        this.$set(
          this.teamDataArr[startTeamIndex].children[startMemberIndex].children[
            startOneIndex
          ].children[startTwoIndex].children,
          startThreeIndex,
          item2
        );
        this.$set(
          this.teamDataArr[endTeamIndex].children[endMemberIndex].children[
            endOneIndex
          ].children[endTwoIndex].children,
          endThreeIndex,
          item1
        );
      }

      // 数据交换
      if (parseInt(this.startExchangeIndex.split("-").length) == 4) {
        let item1 = this.teamDataArr[startTeamIndex].children[startMemberIndex]
          .children[startOneIndex].children[startTwoIndex];

        let item2 = this.teamDataArr[endTeamIndex].children[endMemberIndex]
          .children[endOneIndex].children[endTwoIndex];

        this.$set(
          this.teamDataArr[startTeamIndex].children[startMemberIndex].children[
            startOneIndex
          ].children,
          startTwoIndex,
          item2
        );
        this.$set(
          this.teamDataArr[endTeamIndex].children[endMemberIndex].children[
            endOneIndex
          ].children,
          endTwoIndex,
          item1
        );
      }

      // 数据交换
      if (parseInt(this.startExchangeIndex.split("-").length) == 3) {
        let item1 = this.teamDataArr[startTeamIndex].children[startMemberIndex]
          .children[startOneIndex];

        let item2 = this.teamDataArr[endTeamIndex].children[endMemberIndex]
          .children[endOneIndex];

        this.$set(
          this.teamDataArr[startTeamIndex].children[startMemberIndex].children,
          startOneIndex,
          item2
        );
        this.$set(
          this.teamDataArr[endTeamIndex].children[endMemberIndex].children,
          endOneIndex,
          item1
        );
      }

      // 数据交换
      if (parseInt(this.startExchangeIndex.split("-").length) == 2) {
        let item1 = this.teamDataArr[startTeamIndex].children[startMemberIndex];

        let item2 = this.teamDataArr[endTeamIndex].children[endMemberIndex];

        this.$set(
          this.teamDataArr[startTeamIndex].children,
          startMemberIndex,
          item2
        );
        this.$set(
          this.teamDataArr[endTeamIndex].children,
          endMemberIndex,
          item1
        );
      }

      // let _isMain = !this.teamDataArr[endTeamIndex].children[endMemberIndex]
      //   .isMain;
      // this.teamDataArr[endTeamIndex].children[endMemberIndex].isMain = !this
      //   .teamDataArr[startTeamIndex].children[startMemberIndex].isMain;
      //   this.teamDataArr[startTeamIndex].children[
      //   startMemberIndex
      // ].isMain = _isMain
    },
    onDrop(event) {
      // event.target 都返回目标元素
      if (parseInt(this.startExchangeIndex.split("-").length) == 5) {
        this.endExchangeIndex =
          event.target.className == "three"
            ? event.target.getAttribute("data-id")
            : event.target.parentElement.getAttribute("data-id");
      }
      if (parseInt(this.startExchangeIndex.split("-").length) == 4) {
        this.endExchangeIndex =
          event.target.className == "two"
            ? event.target.getAttribute("data-id")
            : event.target.parentElement.getAttribute("data-id");
      }
      if (parseInt(this.startExchangeIndex.split("-").length) == 3) {
        this.endExchangeIndex =
          event.target.className == "one"
            ? event.target.getAttribute("data-id")
            : event.target.parentElement.getAttribute("data-id");
      }
      if (parseInt(this.startExchangeIndex.split("-").length) == 2) {
        this.endExchangeIndex =
          event.target.className == "top"
            ? event.target.getAttribute("data-id")
            : event.target.parentElement.getAttribute("data-id");
      }
    },

    onDragover(event) {
      // 阻止元素的默认行为，不然ondrop不管用
      event.preventDefault();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.team {
  width: 100%;
}
.top {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.two,
.one {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
}
.topcont {
  width: 50px;
  height: 50px;
  background: green;
  margin-left: 10px;
  margin-top: 10px;
}
.onecont {
  width: 50px;
  height: 50px;
  background: blue;
  margin-left: 10px;
  margin-top: 10px;
}
.twoout,
.oneout {
  display: flex;
  width: 100%;
}
.twocont {
  width: 50px;
  height: 50px;
  background: yellow;
  margin-left: 10px;
  margin-top: 10px;
}
.three {
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.threeout {
  display: flex;
  width: 100%;
}
.threecont {
  width: 50px;
  height: 50px;
  background: red;
  margin-left: 10px;
  margin-top: 10px;
}
.top.on {
  color: purple;
}
.top.on .one,
.top.on .two,
.top.on {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: column-reverse;
  align-items: center;
}
</style>