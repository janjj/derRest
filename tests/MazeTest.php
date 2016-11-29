<?php
namespace derRest\Test;

use derRest\Generator\Maze;

class MazeTest extends \PHPUnit_Framework_TestCase
{
    public function testHeightAndWidth1()
    {

    }

    public function testHeightAndWidth2()
    {

    }

    public function testHeightAndWidth3()
    {

    }

    public function testValidChars()
    {

    }

    public function testSolvable()
    {

    }

    public function testCandyCount1()
    {
        $array = [
            [5, 5, 1],
            [9, 9, 2],
            [15, 13, 4],
            [43, 43, 170]
        ];
        foreach ($array as $row) {

            //Test for correct amount of candies
            $maze = new Maze($row[0], $row[1], $row[2]);
            $maze = $maze->generate()->getMaze();

            $candyCount = 0;
            foreach ($maze as $mazeLine) {
                foreach ($mazeLine as $cell) {
                    if ($cell === Maze::CANDY) {
                        $candyCount++;
                    }
                }
            }
            $this->assertEquals($row[2], $candyCount);
        }
    }

    public function testCandyCount2()
    {
        $array = [
            [5, 5, 500],
            [9, 9, 999],
            [15, 13, 1334],
            [43, 43, 17000]
        ];
        foreach ($array as $row) {
            //more then max candies
            $maze = new Maze($row[0], $row[1], $row[2]);
            $maze = $maze->generate()->getMaze();

            $candyCount = 0;
            foreach ($maze as $mazeLine) {
                foreach ($mazeLine as $cell) {
                    if ($cell === Maze::CANDY) {
                        $candyCount++;
                    }
                }
            }

            $whitespaceCount = 0;
            foreach ($maze as $mazeLine) {
                foreach ($mazeLine as $cell) {
                    if ($cell === Maze::WHITE_SPACE) {
                        $whitespaceCount++;
                    }
                }
            }

            $this->assertEquals(0, $whitespaceCount);
            $this->assertGreaterThanOrEqual(1, $candyCount);
        }
    }

    /**
     * @expectedException \InvalidArgumentException
     */
    public function testCandyCount3()
    {
        //negative number of candies
        $maze = new Maze(15, 15, -5);
    }

    public function testMazeChanging()
    {

    }
}
